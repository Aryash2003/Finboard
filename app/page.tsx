'use client';

import React, { useState } from 'react';
import { Header } from './components/header';
import { WidgetGrid } from '@/components/Dashboard/WidgetGrid';
import { AddWidgetModal } from '@/components/AddWidgetModal';
import { useWidgets } from '@/hooks/useWidgets';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { widgets, addWidget, removeWidget, reorderWidgets } = useWidgets();

  const handleAddWidget = (widget: any) => {
    addWidget(widget);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header
        widgetCount={widgets.length}
        onAddWidget={() => setIsModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WidgetGrid
          widgets={widgets}
          onReorder={reorderWidgets}
          onRemoveWidget={removeWidget}
        />
      </main>

      <AddWidgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddWidget}
      />
    </div>
  );
}