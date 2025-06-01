import React, { useState } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';

interface InternshipDocument {
  id: number;
  name: string;
  type: 'required' | 'optional';
  description: string;
  fileType: string; // PDF, DOC, etc.
  maxSize: number; // MB cinsinden
}

interface InternshipTopic {
  id: string;
  name: string;
  category: 'software' | 'hardware';
  description: string;
  examples: string[];
}

interface InternshipType {
  id: number;
  name: string;
  description: string;
  duration: number; // gün olarak (Erciyes için 20 gün)
  isActive: boolean;
  requirements: string[];
  documents: InternshipDocument[];
  minGPA: number;
  minCompletedCredits: number;
  applicationDeadlineDays: number;
  availableTopics: string[]; // staj konuları
  semesterAfter: number; // hangi yarıyıldan sonra
}

const InternshipTypes: React.FC = () => {
  // Erciyes Üniversitesi Staj Konuları
  const internshipTopics: InternshipTopic[] = [
    // YAZILIM KONULARI
    {
      id: 'Y-1',
      name: 'Uygulama Yazılımları Geliştirme',
      category: 'software',
      description: 'Çeşitli sahalarda uygulama yazılımlarının geliştirilmesi, test edilmesi, bakımlarının yapılması',
      examples: [
        'Windows, Linux, web veya mobil ortamlar için yazılım geliştirme',
        'Veritabanı uygulamaları geliştirme',
        'C, C++, C#, Java, Python, Assembly programlama'
      ]
    },
    {
      id: 'Y-2',
      name: 'Paket Programlar ile Sistem Tasarımı',
      category: 'software',
      description: 'Paket programlar kullanarak sistem tasarımı yapılması ve analiz gerçekleştirme',
      examples: [
        'AutoCAD, Matlab, SolidWorks ile uygulama geliştirme',
        'SAP, Oracle Developer ile uygulama geliştirme',
        'Paket programlarda script ve plug-in geliştirme'
      ]
    },
    {
      id: 'Y-3',
      name: 'Akademik Araştırma ve Geliştirme',
      category: 'software',
      description: 'Üniversite laboratuvarları veya Ar-Ge birimlerinde araştırma ve geliştirme',
      examples: [
        'Akademik projeler geliştirme',
        'Araştırma projeleri',
        'Yenilikçi teknoloji uygulamaları'
      ]
    },
    {
      id: 'Y-4',
      name: 'Mobil Uygulama Geliştirme',
      category: 'software',
      description: 'Mobil platformlar için uygulama geliştirme',
      examples: [
        'Android uygulama geliştirme',
        'iOS uygulama geliştirme',
        'Cross-platform mobil uygulamalar'
      ]
    },
    {
      id: 'Y-5',
      name: 'Bilgi Sistemleri Geliştirme',
      category: 'software',
      description: 'Kurumsal bilgi sistemlerinin geliştirilmesi ve destek faaliyetleri',
      examples: [
        'Hastane bilgi sistemleri',
        'Öğrenci bilgi sistemleri',
        'Üretim/yönetim sistem yazılımları'
      ]
    },
    {
      id: 'Y-6',
      name: 'Özel Yazılım Projeleri',
      category: 'software',
      description: 'Uzmanlaşmış şirketlerde özel yazılım projelerine katılım',
      examples: [
        'Özel sektör yazılım projeleri',
        'İnovatif yazılım çözümleri',
        'Şirkete özel yazılım geliştirme'
      ]
    },
    // DONANIM KONULARI
    {
      id: 'D-1',
      name: 'Gömülü Sistemler ve Donanım',
      category: 'hardware',
      description: 'Gömülü sistemler ve bilgisayar sistemleri üzerinde çalışmalar',
      examples: [
        'Mikroişlemci/mikrodenetleyici tabanlı sistemler',
        'Arduino, Raspberry Pi uygulamaları',
        'IoT (Nesnelerin İnterneti) projeleri'
      ]
    },
    {
      id: 'D-2',
      name: 'Sayısal Devreler ve Robotik',
      category: 'hardware',
      description: 'Elektronik, robotik, mekatronik alanlarda sayısal devrelerin tasarımı',
      examples: [
        'Kontrol devreleri tasarımı',
        'Robot programlama',
        'Biyomedikal cihaz tasarımı',
        'SCADA sistemleri'
      ]
    },
    {
      id: 'D-3',
      name: 'Bilgisayar Ağı Donanımları',
      category: 'hardware',
      description: 'Ağ donanımlarının tasarımı, konfigürasyonu ve yönetimi',
      examples: [
        'Ağ tasarımı ve router/switch konfigürasyonu',
        'Ağ güvenliği uygulamaları',
        '5G ve LTE teknolojileri',
        'IPv6 ağ yapıları'
      ]
    },
    {
      id: 'D-4',
      name: 'Sistem Kurulum ve Konfigürasyon',
      category: 'hardware',
      description: 'Sunucu sistemleri kurulum ve konfigürasyon işlemleri',
      examples: [
        'Sanallaştırma uygulamaları (VMware, ESXi)',
        'Linux/Windows Server kurulumları',
        'Bulut bilişim ve dağıtık sistemler',
        'Cluster yapılar'
      ]
    },
    {
      id: 'D-5',
      name: 'Akademik Donanım Araştırmaları',
      category: 'hardware',
      description: 'Üniversite laboratuvarlarında donanım Ar-Ge çalışmaları',
      examples: [
        'Akademik donanım projeleri',
        'Araştırma ve geliştirme',
        'Yenilikçi donanım teknolojileri'
      ]
    },
    {
      id: 'D-6',
      name: 'Özel Donanım Projeleri',
      category: 'hardware',
      description: 'Uzmanlaşmış firmalarda özel donanım projelerine katılım',
      examples: [
        'Özel sektör donanım projeleri',
        'İnovatif donanım çözümleri',
        'Şirkete özel sistem tasarımları'
      ]
    }
  ];

  const [internshipTypes, setInternshipTypes] = useState<InternshipType[]>([
    { 
      id: 1, 
      name: "Yazılım Stajı (İlk Staj)", 
      description: "4. yarıyıldan sonra yapılan ilk zorunlu staj. Yazılım geliştirme odaklı projeler.",
      duration: 20, // Erciyes standardı
      isActive: true,
      requirements: [
        "4. yarıyılı başarıyla tamamlamış olmak",
        "Akademik başarı ortalaması en az 2.0",
        "İş Sağlığı ve Güvenliği eğitimi alınmış olmak"
      ],
      documents: [
        {
          id: 1,
          name: "Staj Beyannamesi",
          type: 'required',
          description: "OBISIS'ten alınan ve imzalanan staj beyannamesi",
          fileType: "PDF",
          maxSize: 5
        },
        {
          id: 2,
          name: "Güncel Transkript",
          type: 'required',
          description: "OBISIS'ten alınmış güncel transkript",
          fileType: "PDF",
          maxSize: 3
        },
        {
          id: 3,
          name: "İş Sağlığı ve Güvenliği Belgesi",
          type: 'required',
          description: "İSG eğitimi tamamlandığına dair belge (aslı/onaylı kopya)",
          fileType: "PDF",
          maxSize: 3
        },
        {
          id: 4,
          name: "Staj Başvuru Kontrol Formu",
          type: 'required',
          description: "Doldurulup imzalanmış staj başvuru kontrol formu",
          fileType: "PDF",
          maxSize: 2
        },
        {
          id: 5,
          name: "Yüzyüze Staj Taahhüt Dilekçesi",
          type: 'required',
          description: "Doldurulup imzalanmış taahhüt dilekçesi",
          fileType: "PDF",
          maxSize: 2
        }
      ],
      minGPA: 2.0,
      minCompletedCredits: 60, // 4. yarıyıl sonrası tahmini
      applicationDeadlineDays: 10,
      availableTopics: ['Y-1', 'Y-2', 'Y-3', 'Y-4', 'Y-5', 'Y-6'],
      semesterAfter: 4
    },
    { 
      id: 2, 
      name: "Donanım Stajı (İkinci Staj)", 
      description: "6. yarıyıldan sonra yapılan ikinci zorunlu staj. Donanım ve sistem odaklı projeler.",
      duration: 20,
      isActive: true,
      requirements: [
        "6. yarıyılı başarıyla tamamlamış olmak",
        "İlk stajı başarıyla tamamlamış olmak",
        "Akademik başarı ortalaması en az 2.0",
        "Farklı işyerinde yapılması (aynı yerde için komisyon onayı gerekli)"
      ],
      documents: [
        {
          id: 6,
          name: "Staj Beyannamesi",
          type: 'required',
          description: "OBISIS'ten alınan ve imzalanan staj beyannamesi",
          fileType: "PDF",
          maxSize: 5
        },
        {
          id: 7,
          name: "Güncel Transkript",
          type: 'required',
          description: "OBISIS'ten alınmış güncel transkript",
          fileType: "PDF",
          maxSize: 3
        },
        {
          id: 8,
          name: "İlk Staj Sonuç Belgesi",
          type: 'required',
          description: "İlk stajın başarıyla tamamlandığına dair belge",
          fileType: "PDF",
          maxSize: 2
        },
        {
          id: 9,
          name: "Staj Başvuru Kontrol Formu",
          type: 'required',
          description: "Doldurulup imzalanmış staj başvuru kontrol formu",
          fileType: "PDF",
          maxSize: 2
        },
        {
          id: 10,
          name: "Aynı İşyeri Dilekçesi",
          type: 'optional',
          description: "Aynı işyerinde staj yapmak için komisyon onay dilekçesi",
          fileType: "PDF",
          maxSize: 2
        }
      ],
      minGPA: 2.0,
      minCompletedCredits: 90, // 6. yarıyıl sonrası tahmini
      applicationDeadlineDays: 10,
      availableTopics: ['D-1', 'D-2', 'D-3', 'D-4', 'D-5', 'D-6'],
      semesterAfter: 6
    },
    { 
      id: 3, 
      name: "Gönüllü Staj", 
      description: "İsteğe bağlı ek staj. Hem yazılım hem donanım konularından seçilebilir.",
      duration: 20,
      isActive: true,
      requirements: [
        "En az 4. yarıyılı tamamlamış olmak",
        "Akademik başarı ortalaması en az 2.0",
        "Komisyon onayı gerekli"
      ],
      documents: [
        {
          id: 11,
          name: "Gönüllü Staj Dilekçesi",
          type: 'required',
          description: "Gönüllü staj yapmak için dilekçe",
          fileType: "PDF",
          maxSize: 2
        },
        {
          id: 12,
          name: "Komisyon Onay Belgesi",
          type: 'required',
          description: "Staj komisyonundan alınan onay belgesi",
          fileType: "PDF",
          maxSize: 2
        }
      ],
      minGPA: 2.0,
      minCompletedCredits: 60,
      applicationDeadlineDays: 10,
      availableTopics: ['Y-1', 'Y-4', 'D-1', 'D-3'], // Karışık konular
      semesterAfter: 4
    },
    { 
      id: 4, 
      name: "Yurt Dışı Stajı", 
      description: "Yurt dışında yapılan stajlar. Fakülte Yönetim Kurulu onayı gereklidir.",
      duration: 20,
      isActive: true,
      requirements: [
        "İlgili yarıyılı başarıyla tamamlamış olmak",
        "Akademik başarı ortalaması en az 2.5",
        "Fakülte Yönetim Kurulu onayı",
        "Yabancı dil yeterliliği"
      ],
      documents: [
        {
          id: 15,
          name: "Yurt Dışı Staj Dilekçesi",
          type: 'required',
          description: "Yurt dışında staj yapmak için özel dilekçe",
          fileType: "PDF",
          maxSize: 3
        },
        {
          id: 16,
          name: "Fakülte Yönetim Kurulu Kararı",
          type: 'required',
          description: "FYK'dan alınan onay belgesi",
          fileType: "PDF",
          maxSize: 2
        },
        {
          id: 17,
          name: "Yabancı Dil Yeterlilik Belgesi",
          type: 'required',
          description: "İngilizce veya ilgili dil yeterlilik belgesi",
          fileType: "PDF",
          maxSize: 3
        }
      ],
      minGPA: 2.5,
      minCompletedCredits: 60,
      applicationDeadlineDays: 30,
      availableTopics: ['Y-1', 'Y-2', 'Y-3', 'Y-4', 'Y-5', 'Y-6', 'D-1', 'D-2', 'D-3', 'D-4', 'D-5', 'D-6'],
      semesterAfter: 4
    }
  ]);
  
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingType, setEditingType] = useState<InternshipType | null>(null);
  const [newType, setNewType] = useState<Partial<InternshipType>>({
    name: "",
    description: "",
    duration: 20, // Erciyes standardı
    isActive: true,
    requirements: [],
    documents: [],
    minGPA: 2.0,
    minCompletedCredits: 60,
    applicationDeadlineDays: 10,
    availableTopics: [],
    semesterAfter: 4
  });
  const [newRequirement, setNewRequirement] = useState<string>("");
  const [newDocument, setNewDocument] = useState<Partial<InternshipDocument>>({
    name: "",
    type: 'required',
    description: "",
    fileType: "PDF",
    maxSize: 5
  });

  const handleAddType = () => {
    if (!newType.name || !newType.description) return;
    
    const typeToAdd: InternshipType = {
      id: Math.max(0, ...internshipTypes.map(t => t.id)) + 1,
      name: newType.name,
      description: newType.description,
      duration: newType.duration || 20,
      isActive: newType.isActive || true,
      requirements: newType.requirements || [],
      documents: newType.documents || [],
      minGPA: newType.minGPA || 2.0,
      minCompletedCredits: newType.minCompletedCredits || 60,
      applicationDeadlineDays: newType.applicationDeadlineDays || 10,
      availableTopics: newType.availableTopics || [],
      semesterAfter: newType.semesterAfter || 4
    };
    
    setInternshipTypes([...internshipTypes, typeToAdd]);
    resetForm();
  };

  const handleEditType = (type: InternshipType) => {
    setEditingType(type);
    setNewType({...type});
    setShowAddModal(true);
  };

  const handleUpdateType = () => {
    if (!editingType || !newType.name || !newType.description) return;
    
    setInternshipTypes(internshipTypes.map(t => 
      t.id === editingType.id 
        ? {
            ...t,
            name: newType.name!,
            description: newType.description!,
            duration: newType.duration || 20,
            isActive: newType.isActive !== undefined ? newType.isActive : true,
            requirements: newType.requirements || [],
            documents: newType.documents || [],
            minGPA: newType.minGPA || 2.0,
            minCompletedCredits: newType.minCompletedCredits || 60,
            applicationDeadlineDays: newType.applicationDeadlineDays || 10,
            availableTopics: newType.availableTopics || [],
            semesterAfter: newType.semesterAfter || 4
          }
        : t
    ));
    
    resetForm();
  };

  const handleDeleteType = (id: number) => {
    if (window.confirm("Bu staj türünü silmek istediğinizden emin misiniz?")) {
      setInternshipTypes(internshipTypes.filter(t => t.id !== id));
    }
  };

  const handleToggleActive = (id: number) => {
    setInternshipTypes(internshipTypes.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim() === "") return;
    
    setNewType({
      ...newType,
      requirements: [...(newType.requirements || []), newRequirement.trim()]
    });
    setNewRequirement("");
  };

  const handleRemoveRequirement = (index: number) => {
    const updatedRequirements = [...(newType.requirements || [])];
    updatedRequirements.splice(index, 1);
    setNewType({
      ...newType,
      requirements: updatedRequirements
    });
  };

  const handleAddDocument = () => {
    if (!newDocument.name || !newDocument.description) return;
    
    const documentToAdd: InternshipDocument = {
      id: Math.max(0, ...(newType.documents?.map(d => d.id) || []), 0) + 1,
      name: newDocument.name,
      type: newDocument.type || 'required',
      description: newDocument.description,
      fileType: newDocument.fileType || 'PDF',
      maxSize: newDocument.maxSize || 5
    };
    
    setNewType({
      ...newType,
      documents: [...(newType.documents || []), documentToAdd]
    });
    
    setNewDocument({
      name: "",
      type: 'required',
      description: "",
      fileType: "PDF",
      maxSize: 5
    });
  };

  const handleRemoveDocument = (documentId: number) => {
    setNewType({
      ...newType,
      documents: (newType.documents || []).filter(d => d.id !== documentId)
    });
  };

  const handleTopicToggle = (topicId: string) => {
    const currentTopics = newType.availableTopics || [];
    const updatedTopics = currentTopics.includes(topicId)
      ? currentTopics.filter(id => id !== topicId)
      : [...currentTopics, topicId];
    
    setNewType({
      ...newType,
      availableTopics: updatedTopics
    });
  };

  const resetForm = () => {
    setShowAddModal(false);
    setEditingType(null);
    setNewType({
      name: "",
      description: "",
      duration: 20,
      isActive: true,
      requirements: [],
      documents: [],
      minGPA: 2.0,
      minCompletedCredits: 60,
      applicationDeadlineDays: 10,
      availableTopics: [],
      semesterAfter: 4
    });
    setNewRequirement("");
    setNewDocument({
      name: "",
      type: 'required',
      description: "",
      fileType: "PDF",
      maxSize: 5
    });
  };

  const getTopicName = (topicId: string) => {
    const topic = internshipTopics.find(t => t.id === topicId);
    return topic ? `${topic.id}: ${topic.name}` : topicId;
  };

  return (
    <Container>
      <div className="p-5">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Staj Türleri Yönetimi</h2>
            <button 
              className="btn bg-[#13126e] text-white px-4 py-2 rounded flex items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <KeenIcon icon="plus" />
              <span>Yeni Staj Türü</span>
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              Erciyes Üniversitesi Bilgisayar Mühendisliği Bölümü staj türlerini yönetin. 
              Her staj türü için süre, şartlar, belgeler ve staj konularını belirleyebilirsiniz.
            </p>
          </div>

          <div className="space-y-4">
            {internshipTypes.map((type) => (
              <div 
                key={type.id} 
                className={`p-4 rounded-lg border ${type.isActive ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-medium text-gray-900">{type.name}</h3>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        type.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {type.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        {type.duration} iş günü
                      </span>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                        {type.semesterAfter}. yarıyıl sonrası
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{type.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Min. GPA:</span>
                        <span className="ml-1 text-gray-600">{type.minGPA}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Min. Kredi:</span>
                        <span className="ml-1 text-gray-600">{type.minCompletedCredits}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Başvuru Süresi:</span>
                        <span className="ml-1 text-gray-600">{type.applicationDeadlineDays} gün öncesi</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Belge Sayısı:</span>
                        <span className="ml-1 text-gray-600">{type.documents.length} adet</span>
                      </div>
                    </div>
                    
                    {type.requirements.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Gereksinimler:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {type.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {type.availableTopics && type.availableTopics.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Uygun Staj Konuları:</h4>
                        <div className="flex flex-wrap gap-1">
                          {type.availableTopics.map((topicId) => (
                            <span key={topicId} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {getTopicName(topicId)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {type.documents.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Gerekli Belgeler:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {type.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                              <div className="flex-grow">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                                  <span className={`inline-block px-1.5 py-0.5 text-xs font-medium rounded ${
                                    doc.type === 'required' 
                                      ? 'bg-red-100 text-red-700' 
                                      : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {doc.type === 'required' ? 'Zorunlu' : 'İsteğe Bağlı'}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{doc.fileType} - Max {doc.maxSize}MB</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button 
                      className={`btn p-2 rounded ${
                        type.isActive 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      onClick={() => handleToggleActive(type.id)}
                      title={type.isActive ? "Pasif Yap" : "Aktif Yap"}
                    >
                      <KeenIcon icon={type.isActive ? "toggle-off" : "toggle-on"} />
                    </button>
                    <button 
                      className="btn bg-blue-100 text-blue-700 p-2 rounded hover:bg-blue-200"
                      onClick={() => handleEditType(type)}
                      title="Düzenle"
                    >
                      <KeenIcon icon="pencil" />
                    </button>
                    <button 
                      className="btn bg-red-100 text-red-700 p-2 rounded hover:bg-red-200"
                      onClick={() => handleDeleteType(type.id)}
                      title="Sil"
                    >
                      <KeenIcon icon="trash" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {internshipTypes.length === 0 && (
              <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-500">Henüz staj türü eklenmemiş.</p>
                <button 
                  className="btn bg-[#13126e] text-white px-4 py-2 rounded mt-2"
                  onClick={() => setShowAddModal(true)}
                >
                  İlk Staj Türünü Ekle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingType ? 'Staj Türünü Düzenle' : 'Yeni Staj Türü Ekle'}
                  </h3>
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={resetForm}
                  >
                    <KeenIcon icon="cross" className="text-xl" />
                  </button>
                </div>
                
                <div className="max-h-[80vh] overflow-y-auto">
                  <div className="space-y-6">
                    {/* Temel Bilgiler */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Temel Bilgiler</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Staj Türü Adı *
                          </label>
                          <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                            placeholder="Örn: Yazılım Stajı (İlk Staj)"
                            value={newType.name || ""}
                            onChange={(e) => setNewType({...newType, name: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Açıklama *
                          </label>
                          <textarea 
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                            rows={3}
                            placeholder="Staj türü hakkında detaylı açıklama yazın..."
                            value={newType.description || ""}
                            onChange={(e) => setNewType({...newType, description: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Staj Gereksinimleri */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Staj Gereksinimleri</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Süre (iş günü) *
                          </label>
                          <input 
                            type="number" 
                            min="1"
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                            value={newType.duration || 20}
                            onChange={(e) => setNewType({...newType, duration: parseInt(e.target.value)})}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Min. GPA
                          </label>
                          <input 
                            type="number" 
                            min="0" 
                            max="4"
                            step="0.1"
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                            value={newType.minGPA || 2.0}
                            onChange={(e) => setNewType({...newType, minGPA: parseFloat(e.target.value)})}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Min. Kredi
                          </label>
                          <input 
                            type="number" 
                            min="0"
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                            value={newType.minCompletedCredits || 60}
                            onChange={(e) => setNewType({...newType, minCompletedCredits: parseInt(e.target.value)})}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Başvuru Süresi (gün)
                          </label>
                          <input 
                            type="number" 
                            min="1"
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                            value={newType.applicationDeadlineDays || 10}
                            onChange={(e) => setNewType({...newType, applicationDeadlineDays: parseInt(e.target.value)})}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Yarıyıl Sonrası
                          </label>
                          <select 
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                            value={newType.semesterAfter || 4}
                            onChange={(e) => setNewType({...newType, semesterAfter: parseInt(e.target.value)})}
                          >
                            <option value={2}>2. yarıyıl</option>
                            <option value={4}>4. yarıyıl</option>
                            <option value={6}>6. yarıyıl</option>
                            <option value={8}>8. yarıyıl</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Durum
                          </label>
                          <select 
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                            value={newType.isActive ? 'true' : 'false'}
                            onChange={(e) => setNewType({...newType, isActive: e.target.value === 'true'})}
                          >
                            <option value="true">Aktif</option>
                            <option value="false">Pasif</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Staj Konuları */}
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Uygun Staj Konuları</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tüm Konuları Tek Listede */}
                        <div className="md:col-span-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Yazılım Konuları */}
                            <div>
                              <h5 className="text-sm font-medium text-blue-700 mb-3 bg-blue-100 p-2 rounded">Yazılım Konuları</h5>
                              <div className="space-y-2 max-h-60 overflow-y-auto">
                                {internshipTopics.filter(topic => topic.category === 'software').map((topic) => (
                                  <label key={topic.id} className="flex items-start space-x-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="mt-1"
                                      checked={(newType.availableTopics || []).includes(topic.id)}
                                      onChange={() => handleTopicToggle(topic.id)}
                                    />
                                    <div className="flex-grow">
                                      <span className="text-sm font-medium text-gray-900">{topic.id}: {topic.name}</span>
                                      <p className="text-xs text-gray-600">{topic.description}</p>
                                      <div className="mt-1">
                                        {topic.examples.slice(0, 2).map((example, idx) => (
                                          <span key={idx} className="text-xs text-gray-500 block">• {example}</span>
                                        ))}
                                      </div>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Donanım Konuları */}
                            <div>
                              <h5 className="text-sm font-medium text-orange-700 mb-3 bg-orange-100 p-2 rounded">Donanım Konuları</h5>
                              <div className="space-y-2 max-h-60 overflow-y-auto">
                                {internshipTopics.filter(topic => topic.category === 'hardware').map((topic) => (
                                  <label key={topic.id} className="flex items-start space-x-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="mt-1"
                                      checked={(newType.availableTopics || []).includes(topic.id)}
                                      onChange={() => handleTopicToggle(topic.id)}
                                    />
                                    <div className="flex-grow">
                                      <span className="text-sm font-medium text-gray-900">{topic.id}: {topic.name}</span>
                                      <p className="text-xs text-gray-600">{topic.description}</p>
                                      <div className="mt-1">
                                        {topic.examples.slice(0, 2).map((example, idx) => (
                                          <span key={idx} className="text-xs text-gray-500 block">• {example}</span>
                                        ))}
                                      </div>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Özel Gereksinimler */}
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Özel Gereksinimler</h4>
                      <div className="flex gap-2 mb-3">
                        <input 
                          type="text" 
                          className="flex-grow border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                          placeholder="Yeni gereksinim ekle..."
                          value={newRequirement}
                          onChange={(e) => setNewRequirement(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement()}
                        />
                        <button 
                          className="btn bg-[#13126e] text-white px-3 py-2 rounded"
                          onClick={handleAddRequirement}
                          type="button"
                        >
                          <KeenIcon icon="plus" />
                        </button>
                      </div>
                      
                      {newType.requirements && newType.requirements.length > 0 && (
                        <div className="space-y-2">
                          {newType.requirements.map((req, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                              <span className="text-sm text-gray-700">{req}</span>
                              <button 
                                className="btn bg-red-100 text-red-700 p-1 rounded"
                                onClick={() => handleRemoveRequirement(index)}
                                type="button"
                              >
                                <KeenIcon icon="trash" className="text-sm" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Gerekli Belgeler */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Gerekli Belgeler</h4>
                      
                      {/* Belge Ekleme Formu */}
                      <div className="bg-white p-4 rounded border border-gray-200 mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Yeni Belge Ekle</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                          <div>
                            <input 
                              type="text" 
                              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                              placeholder="Belge adı"
                              value={newDocument.name || ""}
                              onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                            />
                          </div>
                          
                          <div>
                            <select 
                              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                              value={newDocument.type || 'required'}
                              onChange={(e) => setNewDocument({...newDocument, type: e.target.value as 'required' | 'optional'})}
                            >
                              <option value="required">Zorunlu</option>
                              <option value="optional">İsteğe Bağlı</option>
                            </select>
                          </div>
                          
                          <div>
                            <select 
                              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                              value={newDocument.fileType || 'PDF'}
                              onChange={(e) => setNewDocument({...newDocument, fileType: e.target.value})}
                            >
                              <option value="PDF">PDF</option>
                              <option value="DOC">DOC</option>
                              <option value="DOCX">DOCX</option>
                              <option value="JPG">JPG</option>
                              <option value="PNG">PNG</option>
                            </select>
                          </div>
                          
                          <div>
                            <input 
                              type="number" 
                              min="1" 
                              max="50"
                              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                              placeholder="Max MB"
                              value={newDocument.maxSize || 5}
                              onChange={(e) => setNewDocument({...newDocument, maxSize: parseInt(e.target.value)})}
                            />
                          </div>
                          
                          <div>
                            <button 
                              className="btn bg-[#13126e] text-white w-full p-2 rounded"
                              onClick={handleAddDocument}
                              type="button"
                            >
                              <KeenIcon icon="plus" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <textarea 
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#13126e] focus:border-transparent"
                            rows={2}
                            placeholder="Belge açıklaması..."
                            value={newDocument.description || ""}
                            onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      {/* Mevcut Belgeler */}
                      {newType.documents && newType.documents.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700">Eklenen Belgeler:</h5>
                          {newType.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                              <div className="flex-grow">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                                    doc.type === 'required' 
                                      ? 'bg-red-100 text-red-700' 
                                      : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {doc.type === 'required' ? 'Zorunlu' : 'İsteğe Bağlı'}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {doc.fileType} - Max {doc.maxSize}MB
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{doc.description}</p>
                              </div>
                              <button 
                                className="btn bg-red-100 text-red-700 p-2 rounded ml-2"
                                onClick={() => handleRemoveDocument(doc.id)}
                                type="button"
                              >
                                <KeenIcon icon="trash" className="text-sm" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button 
                    className="btn bg-gray-300 text-gray-700 px-6 py-2 rounded"
                    onClick={resetForm}
                  >
                    İptal
                  </button>
                  <button 
                    className="btn bg-[#13126e] text-white px-6 py-2 rounded"
                    onClick={editingType ? handleUpdateType : handleAddType}
                  >
                    {editingType ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-6">
          <div className="flex">
            <div className="flex-shrink-0 text-blue-500">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Erciyes Üniversitesi Staj Uygulama İlkeleri:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Her staj 20 iş günü olarak belirlenmiştir</li>
                <li>• Yazılım ve donanım stajlarının ikisi de zorunludur</li>
                <li>• İlk staj 4. yarıyıldan sonra, ikinci staj 6. yarıyıldan sonra yapılır</li>
                <li>• Stajlar farklı işyerlerinde yapılmalıdır (aynı yerde için komisyon onayı)</li>
                <li>• Başvuru belgeleri staj başlangıcından en az 10 gün önce teslim edilmelidir</li>
                <li>• Her stajda mutlaka bir proje tamamlanması gerekmektedir</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default InternshipTypes; 