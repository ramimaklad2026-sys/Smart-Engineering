import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    closestCorners,
    useDraggable,
    useDroppable,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    CalendarDays,
    Check,
    CircleDashed,
    Clock3,
    Edit3,
    GripVertical,
    Loader2,
    MoreHorizontal,
    Plus,
    RotateCcw,
    Trash2,
    UserRound,
    X,
} from "lucide-react";

const API_BASE_URL = "https://buildsphere-backend.onrender.com";

const TASK_STATUSES = [
    "PENDING",
    "IN_PROGRESS",
    "COMPLETED",
    "POSTPONED",
];

const STATUS_CONFIG = {
    PENDING: {
        title: "قيد الانتظار",
        description: "المهام التي لم يبدأ تنفيذها",
        icon: CircleDashed,
        dot: "bg-violet-400",
        iconColor: "text-violet-400",
        count: "bg-violet-500/10 text-violet-300 border-violet-500/20",
        columnBorder: "border-violet-500/15",
        activeBorder: "border-violet-400/70",
        glow: "shadow-violet-500/10",
    },

    IN_PROGRESS: {
        title: "قيد التنفيذ",
        description: "المهام الجاري العمل عليها",
        icon: Loader2,
        dot: "bg-blue-400",
        iconColor: "text-blue-400",
        count: "bg-blue-500/10 text-blue-300 border-blue-500/20",
        columnBorder: "border-blue-500/15",
        activeBorder: "border-blue-400/70",
        glow: "shadow-blue-500/10",
    },

    COMPLETED: {
        title: "مكتملة",
        description: "المهام التي تم إنجازها",
        icon: Check,
        dot: "bg-emerald-400",
        iconColor: "text-emerald-400",
        count: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
        columnBorder: "border-emerald-500/15",
        activeBorder: "border-emerald-400/70",
        glow: "shadow-emerald-500/10",
    },

    POSTPONED: {
        title: "مؤجلة",
        description: "المهام المؤجلة لوقت لاحق",
        icon: Clock3,
        dot: "bg-amber-400",
        iconColor: "text-amber-400",
        count: "bg-amber-500/10 text-amber-300 border-amber-500/20",
        columnBorder: "border-amber-500/15",
        activeBorder: "border-amber-400/70",
        glow: "shadow-amber-500/10",
    },
};

const EMPTY_FORM = {
    title: "",
    description: "",
};

const getToken = () =>
    localStorage.getItem("token") || localStorage.getItem("authToken");

const getErrorMessage = (error, fallbackMessage) =>
    error?.response?.data?.message || fallbackMessage;

const formatDate = (date) => {
    if (!date) return "غير محدد";

    return new Intl.DateTimeFormat("ar", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(date));
};

/* -------------------------------------------------------------------------- */
/*                              بطاقة المهمة                                  */
/* -------------------------------------------------------------------------- */

function TaskCardContent({
    task,
    isDragging = false,
    isUpdating = false,
    onEdit,
    onDelete,
}) {
    const [showActions, setShowActions] = useState(false);

    return (
        <article
            className={`
        group relative rounded-xl border bg-[#101621]
        p-4 text-right transition-all duration-200
        ${isDragging
                    ? "rotate-2 border-blue-400/60 shadow-2xl shadow-blue-950/50"
                    : "border-gray-800/80 hover:-translate-y-0.5 hover:border-gray-700 hover:shadow-xl hover:shadow-black/20"
                }
        ${isUpdating ? "pointer-events-none opacity-60" : ""}
      `}
        >
            {isUpdating && (
                <div className="absolute inset-0 z-20 grid place-items-center rounded-xl bg-[#101621]/70 backdrop-blur-[1px]">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                </div>
            )}

            <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <h4 className="break-words text-sm font-bold leading-6 text-gray-100">
                        {task.title}
                    </h4>
                </div>

                <div className="relative flex shrink-0 items-center gap-1">
                    <button
                        type="button"
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => {
                            event.stopPropagation();
                            setShowActions((current) => !current);
                        }}
                        className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-800 hover:text-gray-200"
                        aria-label="خيارات المهمة"
                    >
                        <MoreHorizontal size={17} />
                    </button>

                    {showActions && (
                        <>
                            <button
                                type="button"
                                className="fixed inset-0 z-30 cursor-default"
                                aria-label="إغلاق القائمة"
                                onClick={() => setShowActions(false)}
                            />

                            <div className="absolute left-0 top-9 z-40 w-36 overflow-hidden rounded-lg border border-gray-800 bg-[#0b0f19] p-1 shadow-2xl">
                                <button
                                    type="button"
                                    onPointerDown={(event) => event.stopPropagation()}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setShowActions(false);
                                        onEdit(task);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-gray-300 transition hover:bg-gray-800 hover:text-white"
                                >
                                    <Edit3 size={14} />
                                    تعديل المهمة
                                </button>

                                <button
                                    type="button"
                                    onPointerDown={(event) => event.stopPropagation()}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setShowActions(false);
                                        onDelete(task);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/10"
                                >
                                    <Trash2 size={14} />
                                    حذف المهمة
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {task.description ? (
                <p className="mb-4 line-clamp-3 whitespace-pre-line text-xs leading-5 text-gray-400">
                    {task.description}
                </p>
            ) : (
                <p className="mb-4 text-xs italic text-gray-600">
                    لا يوجد وصف لهذه المهمة.
                </p>
            )}

            <div className="flex items-center justify-between gap-3 border-t border-gray-800/70 pt-3">
                <div className="flex min-w-0 items-center gap-2">
                    {task.creator?.avatar ? (
                        <img
                            src={task.creator.avatar}
                            alt={task.creator?.name || "صاحب المهمة"}
                            className="h-7 w-7 shrink-0 rounded-full border border-gray-700 object-cover"
                            onError={(event) => {
                                event.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gray-700 bg-gray-800 text-gray-400">
                            <UserRound size={14} />
                        </div>
                    )}

                    <span className="truncate text-[11px] text-gray-400">
                        {task.creator?.name || "مستخدم غير معروف"}
                    </span>
                </div>

                <div className="flex shrink-0 items-center gap-1 text-[10px] text-gray-500">
                    <CalendarDays size={12} />
                    <span>{formatDate(task.createdAt)}</span>
                </div>
            </div>
        </article>
    );
}

function DraggableTaskCard({
    task,
    isUpdating,
    onEdit,
    onDelete,
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useDraggable({
        id: task._id,
        data: {
            type: "TASK",
            task,
            status: task.status,
        },
        disabled: isUpdating,
    });

    const style = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        transition,
        touchAction: "none",
        zIndex: isDragging ? 50 : "auto",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
        relative cursor-grab select-none touch-none
        active:cursor-grabbing
        ${isDragging ? "opacity-30" : "opacity-100"}
      `}
        >
            <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-md p-1 text-gray-500">
                <GripVertical size={16} />
            </div>

            <div
                onPointerDown={(event) => {
                    /*
                     * نمنع أزرار التعديل والحذف من بدء السحب.
                     */
                    if (
                        event.target.closest(
                            "button, input, textarea, select, a"
                        )
                    ) {
                        event.stopPropagation();
                    }
                }}
            >
                <TaskCardContent
                    task={task}
                    isUpdating={isUpdating}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                                عمود الحالة                                 */
/* -------------------------------------------------------------------------- */

function TaskColumn({
    status,
    tasks,
    updatingTaskIds,
    onEdit,
    onDelete,
    onAddTask,
}) {
    const config = STATUS_CONFIG[status];
    const StatusIcon = config.icon;

    const { setNodeRef, isOver } = useDroppable({
        id: status,
        data: {
            type: "COLUMN",
            status,
        },
    });

    return (
        <section
            ref={setNodeRef}
            className={`
        flex min-h-[520px] min-w-[280px] flex-col rounded-2xl
        border bg-[#0b0f19] p-3 transition-all duration-200
        ${isOver ? `${config.activeBorder} shadow-xl ${config.glow}` : config.columnBorder}
      `}
        >
            <header className="mb-3 rounded-xl border border-gray-800/70 bg-[#0d1321] p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div
                            className={`grid h-8 w-8 place-items-center rounded-lg bg-gray-950/60 ${config.iconColor}`}
                        >
                            <StatusIcon
                                size={17}
                                className={status === "IN_PROGRESS" ? "animate-spin [animation-duration:3s]" : ""}
                            />
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-100">
                                {config.title}
                            </h3>

                            <p className="mt-0.5 text-[10px] text-gray-500">
                                {config.description}
                            </p>
                        </div>
                    </div>

                    <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${config.count}`}
                    >
                        {tasks.length}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => onAddTask(status)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-700 py-2 text-[11px] font-medium text-gray-500 transition hover:border-blue-500/50 hover:bg-blue-500/5 hover:text-blue-400"
                >
                    <Plus size={14} />
                    إضافة مهمة
                </button>
            </header>

            <div className="flex flex-1 flex-col gap-3">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <DraggableTaskCard
                            key={task._id}
                            task={task}
                            isUpdating={updatingTaskIds.includes(task._id)}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))
                ) : (
                    <div
                        className={`
              flex flex-1 flex-col items-center justify-center rounded-xl
              border border-dashed p-5 text-center transition
              ${isOver
                                ? `${config.activeBorder} bg-white/[0.02]`
                                : "border-gray-800/70 bg-[#090d16]"
                            }
            `}
                    >
                        <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-gray-900 text-gray-600">
                            <StatusIcon size={19} />
                        </div>

                        <p className="text-xs font-medium text-gray-500">
                            لا توجد مهام هنا
                        </p>

                        <p className="mt-1 max-w-[180px] text-[10px] leading-5 text-gray-600">
                            اسحب مهمة إلى هذا العمود أو أضف مهمة جديدة.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/*                           نافذة إضافة وتعديل مهمة                           */
/* -------------------------------------------------------------------------- */

function TaskFormModal({
    isOpen,
    mode,
    form,
    status,
    isSubmitting,
    onChange,
    onClose,
    onSubmit,
}) {
    if (!isOpen) return null;

    const statusConfig = STATUS_CONFIG[status];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <form
                onSubmit={onSubmit}
                onMouseDown={(event) => event.stopPropagation()}
                className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-800 bg-[#0b0f19] shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
                    <div>
                        <h3 className="text-sm font-bold text-white">
                            {mode === "create" ? "إنشاء مهمة جديدة" : "تعديل المهمة"}
                        </h3>

                        <p className="mt-1 text-[11px] text-gray-500">
                            {mode === "create"
                                ? `ستضاف المهمة إلى عمود: ${statusConfig.title}`
                                : "قم بتحديث عنوان المهمة أو وصفها."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-800 hover:text-white disabled:opacity-40"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-4 p-5">
                    {mode === "create" && (
                        <div>
                            <span className="mb-2 block text-xs font-medium text-gray-400">
                                الحالة الابتدائية
                            </span>

                            <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-[#0d1321] px-3 py-2.5">
                                <span className={`h-2 w-2 rounded-full ${statusConfig.dot}`} />

                                <span className="text-xs text-gray-300">
                                    {statusConfig.title}
                                </span>
                            </div>
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="task-title"
                            className="mb-2 block text-xs font-medium text-gray-400"
                        >
                            عنوان المهمة <span className="text-red-400">*</span>
                        </label>

                        <input
                            id="task-title"
                            type="text"
                            value={form.title}
                            onChange={(event) =>
                                onChange((current) => ({
                                    ...current,
                                    title: event.target.value,
                                }))
                            }
                            placeholder="مثال: مراجعة المخطط الإنشائي"
                            maxLength={150}
                            autoFocus
                            required
                            className="w-full rounded-xl border border-gray-800 bg-[#0d1321] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="task-description"
                            className="mb-2 block text-xs font-medium text-gray-400"
                        >
                            وصف المهمة
                        </label>

                        <textarea
                            id="task-description"
                            value={form.description}
                            onChange={(event) =>
                                onChange((current) => ({
                                    ...current,
                                    description: event.target.value,
                                }))
                            }
                            placeholder="اكتب تفاصيل المهمة والمتطلبات..."
                            rows={5}
                            maxLength={1000}
                            className="w-full resize-none rounded-xl border border-gray-800 bg-[#0d1321] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
                        />

                        <span className="mt-1 block text-left text-[10px] text-gray-600">
                            {form.description.length}/1000
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-gray-800 bg-[#090d16] px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-2.5 text-xs text-gray-400 transition hover:bg-gray-800 hover:text-white disabled:opacity-40"
                    >
                        إلغاء
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting || !form.title.trim()}
                        className="flex min-w-[120px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                جاري الحفظ...
                            </>
                        ) : mode === "create" ? (
                            <>
                                <Plus size={14} />
                                إنشاء المهمة
                            </>
                        ) : (
                            <>
                                <Check size={14} />
                                حفظ التعديلات
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                           نافذة تأكيد الحذف                                */
/* -------------------------------------------------------------------------- */

function DeleteTaskModal({
    task,
    isDeleting,
    onClose,
    onConfirm,
}) {
    if (!task) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                onMouseDown={(event) => event.stopPropagation()}
                className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#0b0f19] p-5 shadow-2xl"
            >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-red-500/10 text-red-400">
                    <Trash2 size={20} />
                </div>

                <h3 className="text-sm font-bold text-white">
                    حذف المهمة
                </h3>

                <p className="mt-2 text-xs leading-6 text-gray-400">
                    هل أنت متأكد من حذف المهمة
                    <span className="font-bold text-gray-200">
                        {" "}
                        “{task.title}”
                    </span>
                    ؟ لا يمكن التراجع عن هذه العملية.
                </p>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-2.5 text-xs text-gray-400 hover:bg-gray-800 disabled:opacity-40"
                    >
                        إلغاء
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex min-w-[110px] items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-500 disabled:opacity-40"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                جاري الحذف...
                            </>
                        ) : (
                            <>
                                <Trash2 size={14} />
                                حذف نهائي
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                             المكون الأساسي                                 */
/* -------------------------------------------------------------------------- */

export default function ProjectTasksBoard({
    projectId,
    tasks: initialTasks = [],
    onTasksChange,
}) {
    const [tasks, setTasks] = useState(initialTasks);
    const [activeTask, setActiveTask] = useState(null);
    const [updatingTaskIds, setUpdatingTaskIds] = useState([]);

    const [taskModal, setTaskModal] = useState({
        isOpen: false,
        mode: "create",
        status: "PENDING",
        taskId: null,
    });

    const [taskForm, setTaskForm] = useState(EMPTY_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [taskToDelete, setTaskToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 7,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 180,
                tolerance: 8,
            },
        }),
        useSensor(KeyboardSensor)
    );

    useEffect(() => {
        setTasks(Array.isArray(initialTasks) ? initialTasks : []);
    }, [initialTasks]);

    const groupedTasks = useMemo(() => {
        return TASK_STATUSES.reduce((columns, status) => {
            columns[status] = tasks.filter((task) => task.status === status);
            return columns;
        }, {});
    }, [tasks]);

    const updateTasksState = (newTasks) => {
        setTasks(newTasks);
        onTasksChange?.(newTasks);
    };

    const showError = (message) => {
        setErrorMessage(message);

        window.setTimeout(() => {
            setErrorMessage("");
        }, 5000);
    };

    const openCreateModal = (status = "PENDING") => {
        setTaskForm(EMPTY_FORM);

        setTaskModal({
            isOpen: true,
            mode: "create",
            status,
            taskId: null,
        });
    };

    const openEditModal = (task) => {
        setTaskForm({
            title: task.title || "",
            description: task.description || "",
        });

        setTaskModal({
            isOpen: true,
            mode: "edit",
            status: task.status,
            taskId: task._id,
        });
    };

    const closeTaskModal = () => {
        if (isSubmitting) return;

        setTaskModal({
            isOpen: false,
            mode: "create",
            status: "PENDING",
            taskId: null,
        });

        setTaskForm(EMPTY_FORM);
    };

    const handleCreateTask = async () => {
        const token = getToken();

        const response = await axios.post(
            `${API_BASE_URL}/api/tasks`,
            {
                title: taskForm.title.trim(),
                description: taskForm.description.trim(),
                projectId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        /*
         * بعض واجهات API تعيد المهمة داخل data.task
         * وبعضها يعيدها داخل data مباشرة.
         */
        const createdTask =
            response.data?.data?.task ||
            response.data?.task ||
            response.data?.data;

        /*
         * الـ API ينشئ المهمة بحالة PENDING افتراضيًا.
         * عند الإضافة من عمود مختلف، نغير الحالة بعد الإنشاء.
         */
        if (
            createdTask?._id &&
            taskModal.status !== "PENDING"
        ) {
            await axios.patch(
                `${API_BASE_URL}/api/tasks/${createdTask._id}/status`,
                {
                    status: taskModal.status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            createdTask.status = taskModal.status;
        }

        if (createdTask?._id) {
            updateTasksState([
                ...tasks,
                {
                    ...createdTask,
                    status: createdTask.status || taskModal.status || "PENDING",
                },
            ]);

            return;
        }

        /*
         * في حال كان رد الإنشاء لا يحتوي بيانات المهمة،
         * ننشئ نسخة مؤقتة حتى يتم تحديث بيانات المشروع من الأب.
         */
        const temporaryTask = {
            _id: `temporary-${Date.now()}`,
            title: taskForm.title.trim(),
            description: taskForm.description.trim(),
            projectId,
            status: taskModal.status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            creator: {
                name: "أنت",
            },
        };

        updateTasksState([...tasks, temporaryTask]);
    };

    const handleEditTask = async () => {
        const token = getToken();

        const response = await axios.patch(
            `${API_BASE_URL}/api/tasks/${taskModal.taskId}`,
            {
                title: taskForm.title.trim(),
                description: taskForm.description.trim(),
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const updatedFromServer =
            response.data?.data?.task ||
            response.data?.task ||
            response.data?.data;

        const updatedTasks = tasks.map((task) =>
            task._id === taskModal.taskId
                ? {
                    ...task,
                    ...updatedFromServer,
                    title: taskForm.title.trim(),
                    description: taskForm.description.trim(),
                    updatedAt:
                        updatedFromServer?.updatedAt || new Date().toISOString(),
                }
                : task
        );

        updateTasksState(updatedTasks);
    };

    const handleTaskSubmit = async (event) => {
        event.preventDefault();

        if (!taskForm.title.trim()) {
            showError("يرجى إدخال عنوان المهمة.");
            return;
        }

        if (!projectId) {
            showError("معرف المشروع غير موجود.");
            return;
        }

        try {
            setIsSubmitting(true);

            if (taskModal.mode === "create") {
                await handleCreateTask();
            } else {
                await handleEditTask();
            }

            closeTaskModal();
        } catch (error) {
            console.error("خطأ أثناء حفظ المهمة:", error);

            showError(
                getErrorMessage(
                    error,
                    taskModal.mode === "create"
                        ? "فشل إنشاء المهمة."
                        : "فشل تعديل المهمة."
                )
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTask = async () => {
        if (!taskToDelete?._id) return;

        const token = getToken();

        try {
            setIsDeleting(true);

            await axios.delete(
                `${API_BASE_URL}/api/tasks/${taskToDelete._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedTasks = tasks.filter(
                (task) => task._id !== taskToDelete._id
            );

            updateTasksState(updatedTasks);
            setTaskToDelete(null);
        } catch (error) {
            console.error("خطأ أثناء حذف المهمة:", error);

            showError(
                getErrorMessage(error, "فشل حذف المهمة، يرجى المحاولة مجددًا.")
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDragStart = ({ active }) => {
        const draggedTask = tasks.find((task) => task._id === active.id);
        setActiveTask(draggedTask || null);
    };

    const resolveTargetStatus = (over) => {
        if (!over) return null;

        /*
         * عند الإسقاط على العمود نفسه يكون over.id هو اسم الحالة.
         */
        if (TASK_STATUSES.includes(over.id)) {
            return over.id;
        }

        /*
         * احتياطًا: عند الإسقاط فوق بطاقة مهمة.
         */
        const targetTask = tasks.find((task) => task._id === over.id);

        return targetTask?.status || over.data?.current?.status || null;
    };

    const handleDragEnd = async ({ active, over }) => {
        setActiveTask(null);

        if (!over) return;

        const taskId = active.id;
        const currentTask = tasks.find((task) => task._id === taskId);
        const newStatus = resolveTargetStatus(over);

        if (
            !currentTask ||
            !newStatus ||
            !TASK_STATUSES.includes(newStatus) ||
            currentTask.status === newStatus
        ) {
            return;
        }

        const previousTasks = [...tasks];

        /*
         * تحديث متفائل:
         * ننقل البطاقة فورًا، ثم نرسل الطلب للباك إند.
         */
        const optimisticTasks = tasks.map((task) =>
            task._id === taskId
                ? {
                    ...task,
                    status: newStatus,
                    updatedAt: new Date().toISOString(),
                }
                : task
        );

        updateTasksState(optimisticTasks);

        setUpdatingTaskIds((current) => [...current, taskId]);

        try {
            const token = getToken();

            await axios.patch(
                `${API_BASE_URL}/api/tasks/${taskId}/status`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
        } catch (error) {
            console.error("خطأ أثناء تغيير حالة المهمة:", error);

            /*
             * إعادة المهمة إلى حالتها السابقة عند فشل الطلب.
             */
            updateTasksState(previousTasks);

            showError(
                getErrorMessage(
                    error,
                    "تعذر تغيير حالة المهمة، وتمت إعادتها إلى مكانها السابق."
                )
            );
        } finally {
            setUpdatingTaskIds((current) =>
                current.filter((id) => id !== taskId)
            );
        }
    };

    return (
        <section className="relative space-y-4" dir="rtl">
            {errorMessage && (
                <div className="fixed bottom-5 left-1/2 z-[150] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start justify-between gap-3 rounded-xl border border-red-500/20 bg-[#160d12] p-4 text-xs text-red-300 shadow-2xl">
                    <span className="leading-5">{errorMessage}</span>

                    <button
                        type="button"
                        onClick={() => setErrorMessage("")}
                        className="shrink-0 text-red-400 hover:text-white"
                    >
                        <X size={15} />
                    </button>
                </div>
            )}

            <header className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-900 bg-[#0b0f19] p-5 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="h-5 w-1 rounded-full bg-blue-500" />

                        <h2 className="text-sm font-bold text-white">
                            لوحة مهام المشروع
                        </h2>

                        <span className="rounded-full border border-gray-800 bg-gray-900 px-2 py-0.5 text-[10px] font-bold text-gray-400">
                            {tasks.length}
                        </span>
                    </div>

                    <p className="mr-3 mt-2 text-xs leading-5 text-gray-500">
                        اسحب بطاقة المهمة إلى عمود آخر لتغيير حالتها مباشرة.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => openCreateModal("PENDING")}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
                >
                    <Plus size={16} />
                    إضافة مهمة جديدة
                </button>
            </header>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragCancel={() => setActiveTask(null)}
                onDragEnd={handleDragEnd}
            >
                <div
                    className="
            grid auto-cols-[minmax(280px,1fr)] grid-flow-col gap-4
            overflow-x-auto pb-0
            xl:grid-flow-row xl:grid-cols-4 xl:overflow-visible
          "
                >
                    {TASK_STATUSES.map((status) => (
                        <TaskColumn
                            key={status}
                            status={status}
                            tasks={groupedTasks[status] || []}
                            updatingTaskIds={updatingTaskIds}
                            onEdit={openEditModal}
                            onDelete={setTaskToDelete}
                            onAddTask={openCreateModal}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeTask ? (
                        <div className="w-[280px]">
                            <TaskCardContent
                                task={activeTask}
                                isDragging
                                onEdit={() => { }}
                                onDelete={() => { }}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-800 bg-[#0b0f19] px-5 py-12 text-center xl:hidden">
                    <RotateCcw size={24} className="mb-3 text-gray-600" />

                    <h3 className="text-sm font-bold text-gray-300">
                        لا توجد مهام في المشروع
                    </h3>

                    <p className="mt-2 text-xs text-gray-500">
                        ابدأ بإنشاء أول مهمة لتنظيم العمل.
                    </p>
                </div>
            )}

            <TaskFormModal
                isOpen={taskModal.isOpen}
                mode={taskModal.mode}
                form={taskForm}
                status={taskModal.status}
                isSubmitting={isSubmitting}
                onChange={setTaskForm}
                onClose={closeTaskModal}
                onSubmit={handleTaskSubmit}
            />

            <DeleteTaskModal
                task={taskToDelete}
                isDeleting={isDeleting}
                onClose={() => {
                    if (!isDeleting) setTaskToDelete(null);
                }}
                onConfirm={handleDeleteTask}
            />
        </section>
    );
}