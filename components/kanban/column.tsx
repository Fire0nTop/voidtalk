import { useMemo } from "react";
import { SortableContext } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react";
import {Column, ColumnDragData, Task} from "@/types/kanban/tasks";
import {TaskCard} from "@/components/kanban/task-card";
import {GlassCard} from "@/components/custom-ui/glass-card";

interface ColumnProps {
    column: Column;
    tasks: Task[];
    isOverlay?: boolean;
}

export function KanbanColumn({ column, tasks, isOverlay }: ColumnProps) {
    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks]);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        } satisfies ColumnDragData,
        attributes: {
            roleDescription: `Column: ${column.title}`,
        },
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    const variants = cva(
        "min-h-[500px] max-h-max w-[350px] max-w-full flex flex-col flex-shrink-0 snap-center",
        {
            variants: {
                dragging: {
                    default: "border-2 border-transparent",
                    over: "ring-2 opacity-30",
                    overlay: "ring-2 ring-primary",
                },
            },
        }
    );

    return (
        <GlassCard
            ref={setNodeRef}
            style={style}
            className={variants({
                dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
            })}
        >
            <CardHeader className="p-4 font-semibold border-b-2 text-left flex flex-row space-between items-center">
                <Button
                    variant={"ghost"}
                    {...attributes}
                    {...listeners}
                    className=" p-1 text-primary/50 -ml-2 h-auto cursor-grab relative"
                >
                    <span className="sr-only">{`Move column: ${column.title}`}</span>
                    <GripVertical />
                </Button>
                <span className="ml-auto">{column.title}</span>
                <Badge variant="secondary" className="ml-2">
                    {tasks.length}
                </Badge>
            </CardHeader>
            <CardContent className="flex flex-grow flex-col gap-2 p-2">
                <SortableContext items={tasksIds}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </SortableContext>
            </CardContent>
        </GlassCard>
    );
}