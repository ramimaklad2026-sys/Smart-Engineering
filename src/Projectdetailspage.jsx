import { useState, useEffect } from "react";
import axios from "axios";
import GeminiChat from "./GeminiChat";

const API_BASE_URL = "https://buildsphere-backend.onrender.com";

const STATUS_CONFIG = {
  "In Progress": { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  Completed: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400" },
  "On Hold": { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-400" },
  Planning: { bg: "bg-gray-500/10", text: "text-gray-400", dot: "bg-gray-400" },
  Pending: { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-400" },
  ACTIVE: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
};

export default function ProjectDetailsPage({ projectId, onBack }) {
  const [project, setProject] = useState(null);
  const [blueprints, setBlueprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpenChat, setIsOpenChat] = useState(false);

  // إشعارات الباك إند
  const [invitations, setInvitations] = useState([]);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBlueprintModal, setShowBlueprintModal] = useState(false);
  const [showEditBlueprintModal, setShowEditBlueprintModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // حقول المشروع
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("ACTIVE");

  // حقل الدعوة
  const [inviteEmail, setInviteEmail] = useState("");

  // حقول إضافة مخطط
  const [bpTitle, setBpTitle] = useState("");
  const [bpDescription, setBpDescription] = useState("");
  const [bpFiles, setBpFiles] = useState([]);

  // حقول تعديل مخطط
  const [selectedBlueprintId, setSelectedBlueprintId] = useState(null);
  const [editBpTitle, setEditBpTitle] = useState("");
  const [editBpDescription, setEditBpDescription] = useState("");
  const [editBpFiles, setEditBpFiles] = useState([]);

  const [noteInputs, setNoteInputs] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  
  const fetchInvitations = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      const response = await axios.get(`${API_BASE_URL}/api/collaborations/my-invitations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.data && response.data.data.invitations) {
        setInvitations(response.data.data.invitations);
      }
    } catch (err) {
      console.error("خطأ أثناء جلب الإشعارات والدعوات الواردة:", err);
    }
  };

  
  const handleInvitationAction = async (invitationId, actionType) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      
      
      const payload = {
        invitationId: invitationId,
        action: actionType.toUpperCase() 
      };

      
      await axios.post(
        `${API_BASE_URL}/api/collaborations/respond`, 
        payload,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      alert(`تم ${actionType === "ACCEPTED" ? "قبول" : "رفض"} الدعوة بنجاح.`);
      
      
      await fetchInvitations();
      if (actionType === "ACCEPTED") {
        refreshData();
      }
    } catch (err) {
      console.error("خطأ أثناء معالجة رد الدعوة:", err.response);
      const errorMsg = err.response?.data?.message || "فشلت عملية إرسال الرد، يرجى التحقق من الاتصال بالسيرفر.";
      alert(`خطأ: ${errorMsg}`);
    } finally {
      setActionLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || localStorage.getItem("authToken");
        const response = await axios.get(`${API_BASE_URL}/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.data) {
          const projectData = response.data.data.project;
          setProject(projectData);
          setBlueprints(response.data.data.blueprints || []);
          if (projectData) {
            setEditTitle(projectData.title || "");
            setEditDescription(projectData.description || "");
            setEditStatus(projectData.status || "ACTIVE");
          }
        }
        
        // جلب الإشعارات بالتزامن مع تفاصيل المشروع
        await fetchInvitations();

      } catch (err) {
        console.error("خطأ أثناء جلب تفاصيل المشروع:", err);
      } finally {
        setLoading(false);
      }
    };
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const refreshData = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      const response = await axios.get(`${API_BASE_URL}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.data) {
        setProject(response.data.data.project);
        setBlueprints(response.data.data.blueprints || []);
      }
      // تحديث الإشعارات أيضاً عند عمل تحديث عام للبيانات
      await fetchInvitations();
    } catch (err) {
      console.error("خطأ تحديث البيانات:", err);
    }
  };

  const handleProjectInviteSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    const cleanEmail = inviteEmail ? inviteEmail.trim().toLowerCase() : "";
    const cleanProjectId = projectId ? String(projectId).trim() : "";

    if (!cleanEmail || !cleanProjectId) {
      alert("خطأ: البريد الإلكتروني أو معرف المشروع غير موجود بشكل سليم.");
      return;
    }

    try {
      setActionLoading(true);
      await axios.post(
        `${API_BASE_URL}/api/collaborations/invite`,
        { projectId: cleanProjectId, receiverEmail: cleanEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert(`تم إرسال وثيقة دعوة الانضمام بنجاح إلى المهندس: ${cleanEmail}`);
      setInviteEmail("");
      setShowInviteModal(false);
      refreshData();
    } catch (err) {
      console.error("تفاصيل الخطأ أثناء إرسال الدعوة الرسمية:", err);
      const errorMsg = err.response?.data?.message || "فشلت عملية إرسال الدعوة، يرجى التحقق من صلاحية الحساب.";
      alert(`فشل الإرسال: ${errorMsg}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddBlueprint = async (e) => {
    e.preventDefault();
    if (!bpTitle.trim()) return alert("يرجى إدخال اسم المخطط الفني الكروكي.");
    if (bpFiles.length === 0) return alert("يرجى اختيار ملف صورة للمخطط كشرط أساسي لتوثيق البيانات.");

    try {
      setActionLoading(true);
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      
      const formData = new FormData();
      formData.append("title", bpTitle.trim());
      formData.append("description", bpDescription.trim() || "No description");
      formData.append("projectId", projectId);
      
      bpFiles.forEach((file) => {
        const fileExtension = file.name.split('.').pop();
        const safeName = `blueprint_${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExtension}`;
        const safeFile = new File([file], safeName, { type: file.type });
        formData.append("images", safeFile);
      });

      await axios.post(`${API_BASE_URL}/api/blueprints`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setBpTitle("");
      setBpDescription("");
      setBpFiles([]);
      setShowBlueprintModal(false);
      refreshData();
    } catch (err) {
      console.error("فشل رفع المخطط:", err);
      alert("فشل رفع المخطط الفني.");
    } finally {
      setActionLoading(false);
    }
  };

  const openEditBlueprintModal = (bp) => {
    setSelectedBlueprintId(bp._id);
    setEditBpTitle(bp.title || "");
    setEditBpDescription(bp.description || "");
    setEditBpFiles([]);
    setShowEditBlueprintModal(true);
  };

  const handleEditBlueprint = async (e) => {
    e.preventDefault();
    if (editBpFiles.length === 0) {
      alert("تنبيه: يجب إرفاق صورة المخطط الجديدة كشرط أساسي لإتمام عملية التعديل بنجاح.");
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      
      const textData = { title: editBpTitle.trim(), description: editBpDescription.trim() };
      await axios.patch(`${API_BASE_URL}/api/blueprints/${selectedBlueprintId}`, textData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });

      const imageFormData = new FormData();
      imageFormData.append("title", editBpTitle.trim());
      imageFormData.append("description", editBpDescription.trim() || "Added during edit");
      imageFormData.append("projectId", projectId);
      
      editBpFiles.forEach((file) => {
        const fileExtension = file.name.split('.').pop();
        const safeName = `edit_blueprint_${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExtension}`;
        const safeFile = new File([file], safeName, { type: file.type });
        imageFormData.append("images", safeFile);
      });

      await axios.post(`${API_BASE_URL}/api/blueprints`, imageFormData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setShowEditBlueprintModal(false);
      refreshData();
      alert("تم تحديث بيانات المخطط ورفع الصورة بنجاح!");
    } catch (err) {
      console.error("خطأ أثناء تعديل وتحديث ملف المخطط الفني:", err);
      alert("فشلت عملية التعديل، يرجى مراجعة حجم الصورة وامتداد الملف.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBlueprint = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المخطط نهائياً؟")) return;
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      await axios.delete(`${API_BASE_URL}/api/blueprints/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshData();
    } catch (err) { console.error("خطأ أثناء حذف المخطط الهندي:", err); }
  };

  const handleAddNote = async (blueprintId, imageId) => {
    const text = noteInputs[blueprintId]?.trim();
    if (!text) return;
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      await axios.post(
        `${API_BASE_URL}/api/blueprints/${blueprintId}/images/${imageId}/notes`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNoteInputs(prev => ({ ...prev, [blueprintId]: "" }));
      refreshData();
    } catch (err) { console.error("خطأ في إضافة الملاحظة المهنية:", err); }
  };

  const handleDeleteNote = async (blueprintId, imageId, noteId) => {
    if (!window.confirm("هل تريد حذف هذه الملاحظة الإشرافية؟")) return;
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      await axios.delete(
        `${API_BASE_URL}/api/blueprints/${blueprintId}/images/${imageId}/notes/${noteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refreshData();
    } catch (err) { console.error("خطأ حذف الملاحظة:", err); }
  };

  const handleEditProject = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      await axios.patch(`${API_BASE_URL}/api/projects/${projectId}`, {
        title: editTitle, description: editDescription, status: editStatus
      }, { headers: { Authorization: `Bearer ${token}` } });
      setShowEditModal(false);
      refreshData();
    } catch (err) { console.error("خطأ تعديل نطاق المشروع:", err); } finally { setActionLoading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 text-sm">جاري تحميل لوحة التحكم الفنية...</p>
        </div>
      </div>
    );
  }

  const statusStyle = STATUS_CONFIG[project?.status || "Pending"] || STATUS_CONFIG["Pending"];
  const inputClass = "w-full bg-[#0d1321] border border-gray-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-right font-sans";

  const handleOpenChat = () => {
    if(!isOpenChat) {
      setIsOpenChat(true);
    }else{
      setIsOpenChat(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#070a13] text-gray-200  font-sans" dir="rtl">
      <header className="bg-[#0b0f19] border-b border-gray-900 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-xs text-gray-400 hover:text-white bg-gray-900 px-3 py-1.5 rounded border border-gray-800">← عودة</button>
            <h1 className="text-base font-bold text-white">{project?.title}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>{project?.status || "Pending"}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* زر الإشعارات المضاف بشكل احترافي مع عدّاد أحمر ديناميكي */}
            <button 
              onClick={() => setShowNotificationsModal(true)} 
              className="relative bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-300 p-2 rounded text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
              title="الإشعارات والدعوات الواردة"
            >
              🔔 <span className="hidden sm:inline">الإشعارات</span>
              {invitations.length > 0 && (
                <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {invitations.length}
                </span>
              )}
            </button>

            <button onClick={() => setShowInviteModal(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded text-xs font-bold shadow-md">📩 دعوة انضمام</button>
            <button onClick={() => setShowBlueprintModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-xs font-bold">📐 إضافة مخطط جديد</button>
            <button onClick={() => setShowEditModal(true)} className="bg-gray-900 border border-gray-800 px-3 py-2 rounded text-xs text-gray-300 hover:bg-gray-800">تعديل المشروع</button>
          </div>
        </div>
      </header>
  <div className="grid grid-cols-5 gap-6 w-full">
        <button onClick={handleOpenChat} className={`fixed top-20 left-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded text-xs font-bold shadow-md mb-4 z-50 ${isOpenChat ? 'bg-red-600 hover:bg-red-500' : '' }`}>
          {isOpenChat ? "إغلاق المساعد الذكي " : "فتح المساعد الذكي "}
        </button>
      <main className={`relative max-w-4xl mx-auto px-2 py-6 ${isOpenChat ? 'col-span-3' : 'col-span-5'}`}>
        <div>
        <section className="bg-[#0b0f19] border border-gray-900 rounded-xl p-5 space-y-2 shadow-sm">
          <span className="text-xs text-gray-500 block font-medium">نطاق العمل ووصف المشروع الفني:</span>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{project?.description || "لا يوجد وصف حالي لهذا المشروع الهندسي."}</p>
        </section>

        <section className="space-y-8">
          <h2 className="text-sm font-bold text-white border-r-2 border-blue-500 pr-2">المخططات واللوحات الهندسية الحالية</h2>
          {blueprints.length === 0 ? (
            <div className="text-center py-20 bg-[#0b0f19] border border-dashed border-gray-900 rounded-xl text-gray-500 text-sm">لم يتم رفع أي مخططات هندسية بعد لهذا المشروع الهيكلي.</div>
          ) : (
            blueprints.map((bp) => {
              const targetImage = bp.images && bp.images.length > 0 ? bp.images[bp.images.length - 1] : null;
              let finalImgUrl = "";
              if (targetImage && targetImage.imageUrl) {
                const cleanPath = targetImage.imageUrl.replace(/^\//, "");
                finalImgUrl = cleanPath.startsWith("http") ? cleanPath : `${API_BASE_URL}/${cleanPath}`;
              }

              return (
                <div key={bp._id} className="bg-[#0b0f19] border border-gray-900 rounded-xl overflow-hidden p-6 space-y-5 shadow-2xl">
                  <div className="flex justify-between items-start border-b border-gray-900/60 pb-3">
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white">{bp.title}</h4>
                      {bp.description && <p className="text-xs text-gray-400 font-normal">{bp.description}</p>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEditBlueprintModal(bp)} className="text-xs text-gray-300 hover:text-blue-400 bg-[#070a13] px-3 py-1.5 rounded border border-gray-800">تعديل وإضافة صورة</button>
                      <button onClick={() => handleDeleteBlueprint(bp._id)} className="text-xs text-gray-500 hover:text-red-400 bg-[#070a13] px-3 py-1.5 rounded border border-gray-800">حذف</button>
                    </div>
                  </div>

                  <div className="w-full bg-[#070a13] rounded-lg border border-gray-900 overflow-hidden flex items-center justify-center p-3 min-h-[350px]">
                    {finalImgUrl ? (
                      <img src={finalImgUrl} className="max-w-full h-auto max-h-[550px] object-contain rounded-md" alt={bp.title} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://placehold.co/800x450/0d1321/38bdf8?text=${encodeURIComponent(bp.title || 'Blueprint')}`; }} />
                    ) : (
                      <div className="text-center text-gray-600 text-xs"><p>لا توجد صورة مرتبطة حالياً بالمخطط الإنشائي.</p></div>
                    )}
                  </div>

                  {targetImage && (
                    <div className="bg-[#070a13] p-2 border border-gray-900 rounded-lg max-w-xl mr-auto flex gap-2 items-center shadow-inner">
                      <input type="text" placeholder="أدخل ملاحظة هندسية دقيقة حول المخطط..." value={noteInputs[bp._id] || ""} onChange={(e) => setNoteInputs(prev => ({ ...prev, [bp._id]: e.target.value }))} onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote(bp._id, targetImage._id); }} className="flex-1 bg-transparent text-white px-3 py-1.5 text-xs focus:outline-none text-right" />
                      <button onClick={() => handleAddNote(bp._id, targetImage._id)} disabled={!noteInputs[bp._id]?.trim()} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white px-4 py-2 rounded text-xs font-bold whitespace-nowrap">إضافة ملاحظة</button>
                    </div>
                  )}

                  <div className="space-y-3 pt-3 border-t border-gray-900/40">
                    <span className="text-xs font-bold text-gray-400">📌 التوجيهات وملاحظات لجنة الإشراف المشتركة:</span>
                    {targetImage?.notes && targetImage.notes.length > 0 ? (
                      <div className="space-y-2">
                        {targetImage.notes.map((note, index) => (
                          <div key={note._id || index} className="bg-[#0d1321] border border-gray-900 p-3 rounded-lg flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <span className="text-[11px] text-gray-500 font-bold">لجنة التدقيق الهندسي</span>
                              <p className="text-gray-300 text-xs whitespace-pre-line">{note.text}</p>
                            </div>
                            <button onClick={() => handleDeleteNote(bp._id, targetImage._id, note._id)} className="text-gray-600 hover:text-red-400 p-1 text-xs">🗑️</button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-xs italic bg-[#070a13]/30 p-4 rounded-lg border border-gray-900/60">لا توجد سجلات ملاحظات فنية معتمدة حالياً.</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>
        </div>
      </main>

        {isOpenChat && (
          <div className="col-span-2 w-full  mx-auto px-0 py-0 sticky top-16 right-0 h-[645px] z-30   border-l border-gray-900 bg-[#0b0f19] shadow-lg">
            <GeminiChat/>
          </div>
        )}

  </div>

      {/* النافذة المنبثقة الخاصة بالإشعارات (الدعوات الواردة) */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b0f19] p-6 rounded-xl max-w-lg w-full border border-gray-900 text-right space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-900 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">🔔 مركز الإشعارات والدعوات الواردة</h3>
              <button onClick={() => setShowNotificationsModal(false)} className="text-gray-500 hover:text-white text-xs bg-gray-900 px-2 py-1 rounded border border-gray-800">إغلاق</button>
            </div>
            
            <div className="max-h-[350px] overflow-y-auto space-y-3 pr-1">
              {invitations.length === 0 ? (
                <p className="text-center text-gray-500 text-xs py-8">لا يوجد لديك أي دعوات معلقة أو إشعارات جديدة حالياً.</p>
              ) : (
                invitations.map((inv) => (
                  <div key={inv._id} className="bg-[#0d1321] border border-gray-800 p-4 rounded-lg space-y-3 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-blue-400">المشروع: {inv.projectId?.title || "غير محدد"}</span>
                      <span className="bg-purple-500/10 text-purple-400 text-[10px] px-2 py-0.5 rounded-full font-medium">{inv.status}</span>
                    </div>
                    <p className="text-gray-300 text-xs">وصلتك دعوة انضمام من قبل حساب الإيميل الفني التالي:</p>
                    <p className="text-xs text-gray-400 font-mono bg-[#070a13] p-1.5 rounded border border-gray-900/40 select-all">
                      {inv.senderId?.email || "إيميل المرسِل غير متوفر"}
                    </p>
                    
                    {/* إضافة أزرار القبول والرفض في حال كانت حالة الدعوة معلقة PENDING */}
                    {inv.status === "PENDING" && (
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-900/50">
                        <button 
                          onClick={() => handleInvitationAction(inv._id, "ACCEPTED")}
                          disabled={actionLoading}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 rounded text-xs font-bold transition-all disabled:opacity-50"
                        >
                          {actionLoading ? "جاري المعالجة..." : "✔ قبول الانضمام"}
                        </button>
                        <button 
                          onClick={() => handleInvitationAction(inv._id, "REJECTED")}
                          disabled={actionLoading}
                          className="flex-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 py-1.5 rounded text-xs font-bold transition-all disabled:opacity-50"
                        >
                          ✖ رفض
                        </button>
                      </div>
                    )}

                    <span className="text-[10px] text-gray-500 block text-left">تاريخ الإنشاء: {new Date(inv.createdAt).toLocaleString("ar-EG")}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b0f19] p-6 rounded-xl max-w-md w-full border border-gray-900 text-right space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white border-b border-gray-900 pb-2">📩 توجيه وثيقة دعوة للمشروع الهندسي</h3>
            <form onSubmit={handleProjectInviteSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">البريد الإلكتروني للمهندس المستهدف *</label>
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className={inputClass} placeholder="example@domain.com" required />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-900">
                <button type="button" onClick={() => setShowInviteModal(false)} className="px-4 py-2 bg-gray-900 border border-gray-800 text-gray-400 rounded-lg text-xs hover:bg-gray-800">إلغاء</button>
                <button type="submit" disabled={actionLoading} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 disabled:opacity-50">
                  {actionLoading ? "جاري الإرسال الفوري..." : "إرسال الدعوة الرسمية"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blueprint Modal */}
      {showBlueprintModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b0f19] p-6 rounded-xl max-w-md w-full border border-gray-900 text-right space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-gray-900 pb-2">📐 رفع مخطط إنشائي جديد</h3>
            <form onSubmit={handleAddBlueprint} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">اسم المخطط الفني *</label>
                <input type="text" value={bpTitle} onChange={(e) => setBpTitle(e.target.value)} className={inputClass} placeholder="مثال: مخطط الأساسات والخرسانة" required />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">الوصف الفني</label>
                <textarea value={bpDescription} onChange={(e) => setBpDescription(e.target.value)} className={inputClass} rows={2} />
              </div>
              <div>
                <label className="text-xs text-blue-400 mb-1 block font-bold">صورة المخطط الرسمية المعتمدة *</label>
                <input type="file" accept="image/*" multiple onChange={(e) => { if (e.target.files) setBpFiles(Array.from(e.target.files)); }} className="w-full text-xs text-gray-400 cursor-pointer" required />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-900">
                <button type="button" onClick={() => setShowBlueprintModal(false)} className="px-4 py-2 bg-gray-900 border border-gray-800 text-gray-400 rounded-lg text-xs hover:bg-gray-800">إلغاء</button>
                <button type="submit" disabled={actionLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 disabled:opacity-50">رفع المخطط الهيكلي</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Blueprint Modal */}
      {showEditBlueprintModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b0f19] p-6 rounded-xl max-w-md w-full border border-gray-900 text-right space-y-4">
            <h3 className="text-sm font-bold text-blue-400 border-b border-gray-900 pb-2">✏️ تعديل المخطط وإعادة رفع الصورة</h3>
            <form onSubmit={handleEditBlueprint} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">العنوان الفني المعدل</label>
                <input type="text" value={editBpTitle} onChange={(e) => setEditBpTitle(e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">وصف التعديلات الطارئة</label>
                <textarea value={editBpDescription} onChange={(e) => setEditBpDescription(e.target.value)} className={inputClass} rows={2} />
              </div>
              <div>
                <label className="text-xs text-emerald-400 mb-1 block font-bold">إرفاق ملف صورة المخطط الجديد (إلزامي) *</label>
                <input type="file" accept="image/*" multiple onChange={(e) => { if (e.target.files) setEditBpFiles(Array.from(e.target.files)); }} className="w-full text-xs text-gray-400" required />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-900">
                <button type="button" onClick={() => setShowEditBlueprintModal(false)} className="px-4 py-2 bg-gray-900 border border-gray-800 text-gray-400 rounded-lg text-xs hover:bg-gray-800">إلغاء</button>
                <button type="submit" disabled={actionLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 disabled:opacity-50">حفظ وحيازة التعديلات</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <form onSubmit={handleEditProject} className="relative bg-[#0b0f19] border border-gray-900 rounded-xl w-full max-w-md p-6 space-y-4 text-right shadow-2xl">
            <h3 className="text-white font-bold text-sm border-b border-gray-900 pb-2">📝 تعديل بيانات ومسمى المشروع الكلية</h3>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">اسم ومسمى المشروع الفني</label>
              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">بيان النطاق والوصف العام</label>
              <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className={inputClass} rows={3} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">حالة الاعتماد والتطوير</label>
              <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className={inputClass}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
            <div className="flex gap-2 pt-3 border-t border-gray-900">
              <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-900 border border-gray-800 text-gray-400 py-2 rounded-lg text-xs hover:bg-gray-800">إلغاء</button>
              <button type="submit" disabled={actionLoading} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-500 disabled:opacity-50">تأكيد التعديل المعتمد</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}