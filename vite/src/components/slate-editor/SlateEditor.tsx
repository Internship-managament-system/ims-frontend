import React, { useCallback, useMemo, useState } from 'react';
import { createEditor, Descendant, BaseEditor, Element as SlateElement, Transforms, Editor } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory, HistoryEditor } from 'slate-history';
import { KeenIcon } from '@/components/keenicons';

// TypeScript types for Slate
type CustomElement = {
  type: 'paragraph' | 'block-quote' | 'bulleted-list' | 'heading-one' | 'heading-two' | 'list-item' | 'numbered-list';
  align?: string;
  children: CustomText[];
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

interface SlateEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const LIST_TYPES = ['numbered-list', 'bulleted-list'] as const;
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'] as const;

// Type guards
const isCustomElement = (node: Descendant): node is CustomElement => {
  return SlateElement.isElement(node) && 'type' in node;
};

const isCustomText = (node: Descendant): node is CustomText => {
  return !SlateElement.isElement(node) && 'text' in node;
};

const SlateEditor: React.FC<SlateEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Açıklamanızı yazın...", 
  className = "" 
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  
  // Convert string to Slate value
  const initialValue: Descendant[] = useMemo(() => {
    if (!value || value === '') {
      return [
        {
          type: 'paragraph',
          children: [{ text: '' }],
        } as CustomElement,
      ];
    }
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [
        {
          type: 'paragraph',
          children: [{ text: value }],
        } as CustomElement,
      ];
    } catch {
      return [
        {
          type: 'paragraph',
          children: [{ text: value }],
        } as CustomElement,
      ];
    }
  }, [value]);

  const [slateValue, setSlateValue] = useState<Descendant[]>(initialValue);

  // Handle changes
  const handleChange = useCallback((newValue: Descendant[]) => {
    setSlateValue(newValue);
    
    // Convert to string for external usage
    const isAstChange = editor.operations.some(
      op => 'set_selection' !== op.type
    );
    
    if (isAstChange) {
      // Check if content is empty
      const firstNode = newValue[0];
      const isValueEmpty = newValue.length === 1 && 
        isCustomElement(firstNode) &&
        firstNode.type === 'paragraph' && 
        firstNode.children.length === 1 && 
        firstNode.children[0].text === '';
      
      if (isValueEmpty) {
        onChange('');
      } else {
        // Convert to HTML-like string for better readability
        const htmlContent = newValue
          .map(node => {
            if (isCustomElement(node)) {
              if (node.type === 'paragraph') {
                const text = node.children.map((child: CustomText) => {
                  let content = child.text;
                  if (child.bold) content = `<strong>${content}</strong>`;
                  if (child.italic) content = `<em>${content}</em>`;
                  if (child.underline) content = `<u>${content}</u>`;
                  return content;
                }).join('');
                return text ? `<p>${text}</p>` : '';
              } else if (node.type === 'bulleted-list') {
                const items = node.children.map((item: any) => {
                  const text = item.children.map((child: CustomText) => child.text).join('');
                  return `<li>${text}</li>`;
                }).join('');
                return `<ul>${items}</ul>`;
              } else if (node.type === 'numbered-list') {
                const items = node.children.map((item: any) => {
                  const text = item.children.map((child: CustomText) => child.text).join('');
                  return `<li>${text}</li>`;
                }).join('');
                return `<ol>${items}</ol>`;
              }
            }
            return '';
          })
          .filter(content => content.length > 0)
          .join('');
        
        onChange(htmlContent || JSON.stringify(newValue));
      }
    }
  }, [editor.operations, onChange]);

  // Toolbar functions
  const toggleMark = (format: keyof Omit<CustomText, 'text'>) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const isMarkActive = (editor: Editor, format: keyof Omit<CustomText, 'text'>) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  const isBlockActive = (editor: Editor, format: string, blockType: keyof CustomElement = 'type') => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: n =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          (n as any)[blockType] === format,
      })
    );

    return !!match;
  };

  const toggleBlock = (editor: Editor, format: string) => {
    const isActive = isBlockActive(
      editor,
      format,
      TEXT_ALIGN_TYPES.includes(format as any) ? 'align' : 'type'
    );

    const isList = LIST_TYPES.includes(format as any);

    Transforms.unwrapNodes(editor, {
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        LIST_TYPES.includes((n as CustomElement).type as any) &&
        !TEXT_ALIGN_TYPES.includes(format as any),
      split: true,
    });

    let newProperties: Partial<CustomElement>;
    if (TEXT_ALIGN_TYPES.includes(format as any)) {
      newProperties = {
        align: isActive ? undefined : format,
      };
    } else {
      newProperties = {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format as CustomElement['type'],
      };
    }

    Transforms.setNodes<SlateElement>(editor, newProperties);

    if (!isActive && isList) {
      const block: CustomElement = { 
        type: format as CustomElement['type'], 
        children: [] 
      };
      Transforms.wrapNodes(editor, block);
    }
  };

  const renderElement = useCallback((props: any) => {
    const { attributes, children, element } = props;

    switch (element.type) {
      case 'block-quote':
        return <blockquote className="border-l-4 border-gray-300 pl-4 italic" {...attributes}>{children}</blockquote>;
      case 'bulleted-list':
        return <ul className="list-disc list-inside ml-4" {...attributes}>{children}</ul>;
      case 'heading-one':
        return <h1 className="text-2xl font-bold" {...attributes}>{children}</h1>;
      case 'heading-two':
        return <h2 className="text-xl font-semibold" {...attributes}>{children}</h2>;
      case 'list-item':
        return <li className="ml-4" {...attributes}>{children}</li>;
      case 'numbered-list':
        return <ol className="list-decimal list-inside ml-4" {...attributes}>{children}</ol>;
      default:
        return <p {...attributes}>{children}</p>;
    }
  }, []);

  const renderLeaf = useCallback((props: any) => {
    let { attributes, children, leaf } = props;

    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }

    if (leaf.italic) {
      children = <em>{children}</em>;
    }

    if (leaf.underline) {
      children = <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
  }, []);

  return (
    <div className={`border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-[#13126e] focus-within:border-transparent ${className}`}>
      <Slate editor={editor} initialValue={slateValue} onValueChange={handleChange}>
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-2 flex gap-1 bg-gray-50 rounded-t-md flex-wrap">
          {/* Text formatting */}
          <button
            type="button"
            className={`p-2 rounded text-sm font-bold ${isMarkActive(editor, 'bold') ? 'bg-[#13126e] text-white' : 'hover:bg-gray-200'}`}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleMark('bold');
            }}
            title="Kalın (Bold)"
          >
            B
          </button>
          
          <button
            type="button"
            className={`p-2 rounded text-sm italic ${isMarkActive(editor, 'italic') ? 'bg-[#13126e] text-white' : 'hover:bg-gray-200'}`}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleMark('italic');
            }}
            title="İtalik (Italic)"
          >
            I
          </button>
          
          <button
            type="button"
            className={`p-2 rounded text-sm underline ${isMarkActive(editor, 'underline') ? 'bg-[#13126e] text-white' : 'hover:bg-gray-200'}`}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleMark('underline');
            }}
            title="Altı Çizili (Underline)"
          >
            U
          </button>

          <div className="border-l border-gray-300 mx-2"></div>

          {/* Lists */}
          <button
            type="button"
            className={`p-2 rounded text-sm ${isBlockActive(editor, 'bulleted-list') ? 'bg-[#13126e] text-white' : 'hover:bg-gray-200'}`}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleBlock(editor, 'bulleted-list');
            }}
            title="Noktalı Liste"
          >
            • List
          </button>

          <button
            type="button"
            className={`p-2 rounded text-sm ${isBlockActive(editor, 'numbered-list') ? 'bg-[#13126e] text-white' : 'hover:bg-gray-200'}`}
            onMouseDown={(event) => {
              event.preventDefault();
              toggleBlock(editor, 'numbered-list');
            }}
            title="Numaralı Liste"
          >
            1. List
          </button>

          <div className="border-l border-gray-300 mx-2"></div>
          
          
        </div>

        {/* Editor */}
        <Editable
          className="p-3 min-h-[120px] focus:outline-none"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          spellCheck
        />
      </Slate>
    </div>
  );
};

export default SlateEditor; 