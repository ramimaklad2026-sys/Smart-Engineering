import { useEffect, useMemo, useRef, useState } from "react";
import {
    ArrowLeft,
    BriefcaseBusiness,
    CalendarDays,
    Camera,
    CheckCircle2,
    Edit3,
    Eye,
    FolderKanban,
    LoaderCircle,
    LockKeyhole,
    LogOut,
    Mail,
    MapPin,
    RefreshCw,
    Save,
    ShieldCheck,
    UserRound,
    X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const API_URL = "https://buildsphere-backend.onrender.com";

function Profile() {
    const { t, i18n } = useTranslation();

    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");

    const token = localStorage.getItem("token");

    const changeLanguage = () => {
    const newLanguage = i18n.language === "en" ? "ar" : "en";

    i18n.changeLanguage(newLanguage);

    document.documentElement.dir =
      newLanguage === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = newLanguage;
  };

    const getImageUrl = (avatar) => {
        if (!avatar) return "";

        if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
            return avatar;
        }

        return `${API_URL}${avatar.startsWith("/") ? avatar : `/${avatar}`}`;
    };

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            if (!token) {
                throw new Error("لم يتم العثور على رمز تسجيل الدخول.");
            }

            const response = await fetch(`${API_URL}/api/profiles/me`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.message ||
                    result?.error ||
                    "تعذر تحميل بيانات الملف الشخصي."
                );
            }

            const userData = result?.data?.user;
            const projectsData = result?.data?.projects || [];

            setProfile(userData);
            setProjects(projectsData);
            setName(userData?.name || "");
            setAvatarPreview(getImageUrl(userData?.avatar));
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        return () => {
            if (avatarPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    const statistics = useMemo(() => {
        const completed = projects.filter((project) =>
            ["COMPLETED", "FINISHED"].includes(project.status)
        ).length;

        const active = projects.filter((project) =>
            ["ACTIVE", "IN_PROGRESS"].includes(project.status)
        ).length;

        const publicProjects = projects.filter(
            (project) => project.visibility === "PUBLIC"
        ).length;

        return {
            total: projects.length,
            completed,
            active,
            publicProjects,
        };
    }, [projects]);

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("يرجى اختيار ملف صورة صالح.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("حجم الصورة يجب ألا يتجاوز 5MB.");
            return;
        }

        if (avatarPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(avatarPreview);
        }

        setError("");
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleUpdateProfile = async (event) => {
        event.preventDefault();

        try {
            setUpdating(true);
            setError("");

            if (!name.trim()) {
                throw new Error("اسم المستخدم مطلوب.");
            }

            const formData = new FormData();
            formData.append("name", name.trim());

            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            const response = await fetch(`${API_URL}/api/profiles/me`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.message ||
                    result?.error ||
                    "حدث خطأ أثناء تحديث الملف الشخصي."
                );
            }

            const updatedUser = result?.data?.user;

            setProfile(updatedUser);
            setName(updatedUser?.name || "");
            setAvatarPreview(getImageUrl(updatedUser?.avatar));
            setAvatarFile(null);
            setIsEditing(false);
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setUpdating(false);
        }
    };

    const cancelEditing = () => {
        if (avatarPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(avatarPreview);
        }

        setName(profile?.name || "");
        setAvatarFile(null);
        setAvatarPreview(getImageUrl(profile?.avatar));
        setError("");
        setIsEditing(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    // Styles reused across components
    const globalBg = "bg-[#020817] bg-[radial-gradient(circle_at_15%_5%,rgba(37,99,235,0.08),transparent_25%),#020817]";
    const btnBase = "inline-flex items-center justify-center gap-[9px] rounded-[10px] font-bold cursor-pointer transition-all duration-[0.18s] hover:-translate-y-[1px]";

    if (loading) {
        return (
            <main className={`min-h-screen p-5 grid place-items-center text-white ${globalBg} font-['Inter',system-ui,sans-serif]`}>
                <div className="w-full max-w-[440px] p-10 text-center border border-[#223047] rounded-[18px] bg-[#101a2d]">
                    <LoaderCircle className="animate-[spin_0.8s_linear_infinite] mx-auto text-[#3b82f6]" size={42} />
                    <h2 className="mt-[18px] mb-[8px] text-[24px] font-bold">{t("pro.Load_pro")}</h2>
                    <p className="m-0 mb-[23px] text-[#7183a4]">{t("pro.pless")}</p>
                </div>
            </main>
        );
    }

    if (error && !profile) {
        return (
            <main className={`min-h-screen p-5 grid place-items-center text-white ${globalBg} font-['Inter',system-ui,sans-serif]`}>
                <div className="w-full max-w-[440px] p-10 text-center border border-[#223047] rounded-[18px] bg-[#101a2d]">
                    <X size={40} className="mx-auto text-[#fb7185]" />
                    <h2 className="mt-[18px] mb-[8px] text-[24px] font-bold">Unable to load profile</h2>
                    <p className="m-0 mb-[23px] text-[#7183a4]">{error}</p>

                    <button className={`${btnBase} min-h-[45px] px-[19px] text-white bg-[#2563eb]`} onClick={fetchProfile}>
                        <RefreshCw size={18} />
                        {t("pro.TryAgain")}
                    </button>
                </div>
            </main>
        );
    }

    return (
        <div className={`min-h-screen text-white ${globalBg} font-['Inter',system-ui,sans-serif]`}>
            <style>{`
        @keyframes modalEnter {
          from { transform: translateY(12px) scale(0.98); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>

            <header className="py-2 max-[760px]:h-auto border-b border-[#1e293b] bg-[rgba(2,8,23,0.92)] backdrop-blur-[18px]">
                <div className="w-[calc(100%-48px)] max-[760px]:w-[min(100%-28px,1490px)] max-w-[1490px] mx-auto h-full max-[760px]:py-[15px] flex items-center justify-between">
                    <a href="/projects" className="flex items-center gap-[14px]">
                        <div className="w-[42px] h-[42px] grid place-items-center rounded-[11px] text-white bg-gradient-to-br from-[#3b82f6] to-[#2563eb] shadow-[0_8px_24px_rgba(37,99,235,0.25)]">
                            <FolderKanban size={23} />
                        </div>

                        <div>
                            <h1 className="m-0 text-[19px] leading-[1.2] font-bold">Smart Projects</h1>
                            <p className="m-[3px_0_0] text-[#64748b] text-[14px]">Live Database Management</p>
                        </div>
                    </a>

                    <div className="flex items-center gap-3">
                        <button
            onClick={changeLanguage}
            className="text-gray-300 hover:text-white text-sm transition-colors px-4 py-2"
          >
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </button>
                        <a href="/projects" className={`${btnBase} min-h-10 px-5 text-gray-200 border border-[#334155] bg-[#111c2f]`}>
                            <ArrowLeft size={18} />
                            Back to Projects
                        </a>

                        <button className={`${btnBase} min-h-10 px-5 text-red-400 border border-[rgba(8,4,4,0.27)] bg-[rgba(244,63,94,0.08)]`} onClick={handleLogout}>
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="w-full px-4 mx-auto mt-3 pb-12">
                {error && profile && (
                    <div className="min-h-20 mb-5 py-7 px-5 flex items-center justify-between border border-red-900 rounded-lg text-shadow-red-200 bg-[rgba(244,63,94,0.09)]">
                        <span>{error}</span>
                        <button className="grid place-items-center text-inherit cursor-pointer bg-transparent border-0" onClick={() => setError("")}>
                            <X size={18} />
                        </button>
                    </div>
                )}

                <section className="relative min-h-52 overflow-hidden border border-[#223047] rounded-[18px] bg-[#101a2d] shadow-[0_22px_60px_rgba(0,0,0,0.2)]">
                    <div className="h-[132px] border-b border-[rgba(59,130,246,0.18)] bg-[linear-gradient(120deg,rgba(37,99,235,0.32),rgba(15,23,42,0.1)),radial-gradient(circle_at_80%_35%,rgba(56,189,248,0.18),transparent_28%),repeating-linear-gradient(135deg,rgba(148,163,184,0.04)_0,rgba(148,163,184,0.04)_1px,transparent_1px,transparent_17px)]" />

                    <div className="relative -mt-12 px-[30px] pb-[29px] flex items-end gap-[24px]">
                        <div className="relative shrink-0">
                            <div className="w-[118px] h-[118px] grid place-items-center overflow-hidden border-[5px] border-[#101a2d] rounded-[27px] text-[#93c5fd] bg-gradient-to-br from-[#1e3a8a] to-[#172554] shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt={profile?.name} className="w-full h-full object-cover" />
                                ) : (
                                    <UserRound size={52} />
                                )}
                            </div>

                            <span className="absolute -right-[1px] bottom-[9px] w-[20px] h-[20px] border-[4px] border-[#101a2d] rounded-full bg-[#22c55e]" />
                        </div>

                        <div className="min-w-0 flex-1 pb-[6px]">
                            <div className="flex items-center flex-wrap gap-[12px]">
                                <h2 className="m-0 text-white text-[clamp(25px,3vw,34px)] font-bold">{profile?.name}</h2>

                                <span className="hidden md:block min-h-[29px] px-4  md:inline-flex items-center gap-2 border border-blue-800 rounded-full text-blue-300 bg-[rgba(37,99,235,0.12)] text-3 font-bold">
                                    <ShieldCheck size={15} />
                                    {t("pro.VerifiedUser")}
                                </span>
                            </div>

                            <p className="m-2 flex items-center gap-2 text-[#94a3b8]">
                                <Mail size={17} />
                                {profile?.email}
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <span className="flex items-center gap-2 text-[#64748b] text-[13px]">
                                    <BriefcaseBusiness size={16} />
                                    {formatRole(profile?.role)}
                                </span>

                                <span className="flex items-center gap-2 text-[#64748b] text-[13px]">
                                    <CalendarDays size={16} />
                                    {t("pro.BuildSpheremember")}
                                </span>
                            </div>
                        </div>

                        <button
                            className={`${btnBase} py-3 mb-3 px-4 text-white bg-[#2563eb] shadow-[0_12px_25px_rgba(37,99,235,0.24)]`}
                            onClick={() => setIsEditing(true)}
                        >
                            <Edit3 size={18} />
                            <span className="hidden md:block">
                                {t("pro.EditProfile")}

                            </span>
                        </button>
                    </div>
                </section>

                <section className="mt-4 grid grid-cols-4 max-[1100px]:grid-cols-2 gap-[18px]">
                    <StatisticCard icon={<FolderKanban />} value={statistics.total} label="Total Projects" variant="blue" />
                    <StatisticCard icon={<RefreshCw />} value={statistics.active} label="Active Projects" variant="yellow" />
                    <StatisticCard icon={<CheckCircle2 />} value={statistics.completed} label="Completed" variant="green" />
                    <StatisticCard icon={<Eye />} value={statistics.publicProjects} label="Public Projects" variant="purple" />
                </section>

                <section className="mt-4 grid grid-cols-[minmax(320px,0.8fr)_minmax(500px,1.45fr)] max-[1100px]:grid-cols-1 gap-[22px] items-start">
                    <div className="border border-[#223047] rounded-xl bg-[#101a2d] p-5">
                        <div className="pb-8 flex items-start justify-between gap-3 border-b border-[#1e2b40]">
                            <div>
                                <h3 className="m-0 text-white text-[18px] font-bold">{t("pro.AccountInformation")}</h3>
                                <p className="m-[6px_0_0] text-[#64748b] text-[13px]">{t("pro.personalAndAccount")}</p>
                            </div>
                            <UserRound size={21} className="text-[#60a5fa]" />
                        </div>

                        <div className="grid">
                            <InformationItem icon={<UserRound />} label="Full Name" value={profile?.name} />
                            <InformationItem icon={<Mail />} label="Email Address" value={profile?.email} />
                            <InformationItem icon={<ShieldCheck />} label="Account Role" value={formatRole(profile?.role)} />
                            <InformationItem icon={<LockKeyhole />} label="User ID" value={profile?._id} mono />
                        </div>
                    </div>

                    <div className="border border-[#223047] rounded-xl bg-[#101a2d] px-5 py-3">
                        <div className="pb-5 flex items-start justify-between gap-3 border-b border-[#1e2b40]">
                            <div>
                                <h3 className="m-0 text-white text-[18px] font-bold">{t("pro.RecentProjects")}</h3>
                                <p className="m-[6px_0_0] text-[#64748b] text-[13px]">{t("pro.ProjectsOwned")}</p>
                            </div>
                            <a href="/projects" className="text-[#60a5fa] text-[14px] font-bold">{t("pro.ViewAll")}</a>
                        </div>

                        {projects.length === 0 ? (
                            <div className="min-h-48 p-10 flex items-center justify-center flex-col text-center text-[#64748b]">
                                <FolderKanban size={38} className="mb-5 text-[#3b82f6]" />
                                <h4 className="m-0 text-[#e2e8f0] font-bold">{t("pro.NoProjectsYet")}</h4>
                                <p className="m-[7px_0_19px] text-[13px]">{t("pro.YourCreatedProjects")}</p>

                                <a href="/projects/new" className={`${btnBase} py-3 px-5 text-white bg-[#2563eb]`}>
                                    {t("pro.CreateProject")}
                                </a>
                            </div>
                        ) : (
                            <div className="grid">
                                {projects.slice(0, 4).map((project) => (
                                    <ProfileProjectCard key={project._id} project={project} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {isEditing && (
                <div className="fixed z-50 inset-0 p-8 grid place-items-center overflow-y-auto bg-[rgba(2,6,23,0.82)] backdrop-blur-lg" onMouseDown={cancelEditing}>
                    <form
                        className="w-[min(530px,100%)] p-10 border border-[#2b3a52] rounded-[18px] bg-[#101a2d] shadow-[0_30px_90px_rgba(0,0,0,0.5)] animate-[modalEnter_0.2s_ease]"
                        onSubmit={handleUpdateProfile}
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <div className="pb-7 flex items-start justify-between border-b border-[#243249]">
                            <div>
                                <h3 className="m-0 text-[21px] font-bold">Edit Profile</h3>
                                <p className="m-[6px_0_0] text-[#64748b] text-[13px]">Update your name and profile picture.</p>
                            </div>

                            <button type="button" className="w-[38px] h-[38px] grid place-items-center rounded-[9px] text-[#94a3b8] cursor-pointer bg-[#172338] border-0" onClick={cancelEditing}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="my-10 p-4 flex items-center gap-[16px] border border-[#243249] rounded-[13px] bg-[#0c1527]">
                            <div className="w-16 h-16 grid place-items-center overflow-hidden shrink-0 rounded-[18px] text-[#93c5fd] bg-[#172554]">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                                ) : (
                                    <UserRound size={45} />
                                )}
                            </div>

                            <div>
                                <button
                                    type="button"
                                    className={`${btnBase} min-h-[39px] px-7 text-[#dbeafe] border border-[#31528d] bg-[rgba(37,99,235,0.13)]`}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Camera size={18} />
                                    Choose New Photo
                                </button>

                                <p className="m-[8px_0_0] text-[#64748b] text-[11px]">JPG, PNG or WEBP. Maximum size 5MB.</p>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleAvatarChange}
                                hidden
                            />
                        </div>

                        <label className="mt-[17px] block">
                            <span className="mb-[8px] block text-[#cbd5e1] text-[13px] font-bold">Full Name</span>

                            <div className="min-h-[49px] px-[14px] flex items-center gap-[10px] border border-[#30405a] rounded-[10px] bg-[#0c1527] transition-colors duration-[0.18s] focus-within:border-[#3b82f6]">
                                <UserRound size={18} className="shrink-0 text-[#64748b]" />

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Enter your full name"
                                    disabled={updating}
                                    className="w-full border-0 outline-none text-[#f8fafc] bg-transparent placeholder:text-[#52627e] font-inherit"
                                />
                            </div>
                        </label>

                        <label className="mt-[17px] block">
                            <span className="mb-[8px] block text-[#cbd5e1] text-[13px] font-bold">Email Address</span>

                            <div className="min-h-[49px] px-[14px] flex items-center gap-[10px] border border-[#30405a] rounded-[10px] bg-[#0c1527] transition-colors duration-[0.18s] focus-within:border-[#3b82f6] opacity-[0.65]">
                                <Mail size={18} className="shrink-0 text-[#64748b]" />

                                <input type="email" value={profile?.email || ""} disabled className="w-full border-0 outline-none text-[#f8fafc] bg-transparent font-inherit" />
                            </div>

                            <small className="mt-[7px] block text-[#64748b] text-[11px]">Email cannot be changed from this page.</small>
                        </label>

                        <div className="mt-[25px] pt-[19px] flex justify-end gap-[11px] border-t border-[#243249]">
                            <button
                                type="button"
                                className={`${btnBase} min-h-[45px] px-[20px] text-[#cbd5e1] border border-[#334155] bg-[#172338] disabled:cursor-not-allowed disabled:opacity-[0.65]`}
                                onClick={cancelEditing}
                                disabled={updating}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className={`${btnBase} min-h-[45px] px-[19px] text-white bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-[0.65]`}
                                disabled={updating}
                            >
                                {updating ? (
                                    <>
                                        <LoaderCircle className="animate-[spin_0.8s_linear_infinite]" size={18} />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

function StatisticCard({ icon, value, label, variant }) {
    const variantStyles = {
        blue: "text-[#60a5fa] bg-[rgba(37,99,235,0.14)]",
        yellow: "text-[#facc15] bg-[rgba(234,179,8,0.12)]",
        green: "text-[#34d399] bg-[rgba(16,185,129,0.12)]",
        purple: "text-[#c084fc] bg-[rgba(168,85,247,0.12)]",
    };

    return (
        <article className="py-5 p-2 flex items-center gap-3 border border-[#223047] rounded-[15px] bg-[#101a2d]">
            <div className={`w-12 h-12 grid place-items-center shrink-0 rounded-xl [&>svg]:w-[24px] [&>svg]:h-[24px] ${variantStyles[variant]}`}>
                {icon}
            </div>

            <div>
                <strong className="block text-white text-[28px] leading-none">{value}</strong>
                <span className="block mt-1 text-[#7183a4] text-[14px]">{label}</span>
            </div>
        </article>
    );
}

function InformationItem({ icon, label, value, mono = false }) {
    return (
        <div className="py-7 flex items-center gap-[14px] border-b border-[#1e2b40] last:border-b-0 last:pb-0">
            <div className="w-[41px] h-[41px] grid place-items-center shrink-0 rounded-[10px] text-[#60a5fa] bg-[rgba(37,99,235,0.11)] [&>svg]:w-[18px]">
                {icon}
            </div>

            <div>
                <span className="block text-[#64748b] text-[12px]">{label}</span>
                <strong className={`block max-w-[330px] mt-[5px] overflow-hidden text-[14px] text-ellipsis whitespace-nowrap ${mono ? "text-[#94a3b8] font-[Courier_New,monospace] text-[12px]" : "text-[#e2e8f0]"}`}>
                    {value || "Not provided"}
                </strong>
            </div>
        </div>
    );
}

function ProfileProjectCard({ project }) {
    const statusClass = getStatusClassTailwind(project.status);

    return (
        <article className="py-[19px] flex gap-[15px] border-b border-[#1e2b40] last:pb-0 last:border-b-0">
            <div className="w-[45px] h-[45px] grid place-items-center shrink-0 rounded-[11px] text-[#60a5fa] bg-[rgba(37,99,235,0.13)]">
                <FolderKanban size={21} />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-[15px]">
                    <h4 className="m-0 overflow-hidden text-[#f8fafc] text-[15px] text-ellipsis whitespace-nowrap font-bold">
                        {project.title}
                    </h4>

                    <span className={`shrink-0 px-[10px] py-[5px] rounded-full text-[11px] font-[800] ${statusClass}`}>
                        {formatStatus(project.status)}
                    </span>
                </div>

                <p className="my-[8px] mb-[12px] text-[#7183a4] text-[13px] leading-[1.55] overflow-hidden line-clamp-1 [display:-webkit-box] [-webkit-box-orient:vertical]">
                    {project.description || "No project description available."}
                </p>

                <div className="flex items-center justify-between gap-[15px]">
                    <div className="flex flex-wrap gap-[14px]">
                        {project.location && (
                            <span className="flex items-center gap-[5px] text-[#64748b] text-[11px]">
                                <MapPin size={14} />
                                {project.location}
                            </span>
                        )}

                        <span className="flex items-center gap-[5px] text-[#64748b] text-[11px]">
                            <CalendarDays size={14} />
                            {formatDate(project.createdAt)}
                        </span>

                        <span className="flex items-center gap-[5px] text-[#64748b] text-[11px]">
                            <Eye size={14} />
                            {formatVisibility(project.visibility)}
                        </span>
                    </div>

                    <a href={`/projects/${project._id}`} className="flex items-center gap-[5px] text-[#60a5fa] text-[13px] font-bold">
                        View
                        <ArrowLeft size={15} className="rotate-180" />
                    </a>
                </div>
            </div>
        </article>
    );
}

function formatRole(role) {
    if (!role) return "User";

    return role
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function formatStatus(status) {
    if (!status) return "Pending";

    const statusLabels = {
        ACTIVE: "Active",
        IN_PROGRESS: "In Progress",
        COMPLETED: "Completed",
        FINISHED: "Completed",
        ON_HOLD: "On Hold",
        PENDING: "Pending",
        CANCELLED: "Cancelled",
    };

    return statusLabels[status] || formatRole(status);
}

function getStatusClassTailwind(status) {
    const classes = {
        ACTIVE: "text-[#60a5fa] bg-[rgba(37,99,235,0.14)]",
        IN_PROGRESS: "text-[#60a5fa] bg-[rgba(37,99,235,0.14)]",
        COMPLETED: "text-[#34d399] bg-[rgba(16,185,129,0.13)]",
        FINISHED: "text-[#34d399] bg-[rgba(16,185,129,0.13)]",
        ON_HOLD: "text-[#facc15] bg-[rgba(234,179,8,0.13)]",
        PENDING: "text-[#c084fc] bg-[rgba(168,85,247,0.13)]",
        CANCELLED: "text-[#fb7185] bg-[rgba(244,63,94,0.13)]",
    };

    return classes[status] || "text-[#c084fc] bg-[rgba(168,85,247,0.13)]";
}

function formatVisibility(visibility) {
    return visibility === "PUBLIC" ? "Public" : "Private";
}

function formatDate(date) {
    if (!date) return "Unknown date";

    return new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

export default Profile;