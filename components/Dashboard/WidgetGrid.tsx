'use client';

import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Widget } from '@/types/widget';
import { WidgetCard } from '../Widget/WidgetCard';

interface WidgetGridProps {
    widgets: Widget[];
    onReorder: (widgets: Widget[]) => void;
    onRemoveWidget: (widgetId: string) => void;
}

interface SortableWidgetProps {
    widget: Widget;
    onRemove: () => void;
}

const SortableWidget: React.FC<SortableWidgetProps> = ({ widget, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: widget.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <WidgetCard
                widget={widget}
                onRemove={onRemove}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    );
};

export const WidgetGrid: React.FC<WidgetGridProps> = ({
    widgets,
    onReorder,
    onRemoveWidget,
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = widgets.findIndex((w) => w.id === active.id);
            const newIndex = widgets.findIndex((w) => w.id === over.id);

            const newWidgets = arrayMove(widgets, oldIndex, newIndex).map(
                (w, index) => ({ ...w, order: index })
            );
            onReorder(newWidgets);
        }
    };

    // Show loading state during SSR and initial client render
    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-[400px] bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-700">
                <div className="text-center p-8">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
                    <p className="text-slate-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (widgets.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px] bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-700">
                <div className="text-center p-8">
                    <svg
                        className="w-20 h-20 text-slate-700 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                    </svg>
                    <h3 className="text-xl font-semibold text-slate-400 mb-2">
                        No Widgets Yet
                    </h3>
                    <p className="text-slate-500 max-w-md">
                        Click the "Add Widget" button to connect to a finance API and create your first widget
                    </p>
                </div>
            </div>
        );
    }

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={widgets.map((w) => w.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {widgets.map((widget) => (
                        <SortableWidget
                            key={widget.id}
                            widget={widget}
                            onRemove={() => onRemoveWidget(widget.id)}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};
