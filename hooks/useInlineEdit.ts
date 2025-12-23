import { useState, useCallback } from 'react';
import { DEBOUNCE_MS } from '../constants';

interface InlineEditState {
    id: string;
    field: string;
    value: string;
}

interface UseInlineEditOptions {
    onSave: (id: string, field: string, value: string) => Promise<void>;
    feedbackDurationMs?: number;
}

interface UseInlineEditReturn {
    editState: InlineEditState | null;
    savingId: string | null;
    startEdit: (id: string, field: string, value: string) => void;
    updateValue: (value: string) => void;
    save: () => Promise<void>;
    cancel: () => void;
    isEditing: (id: string, field: string) => boolean;
    justSaved: (id: string) => boolean;
}

/**
 * Custom hook for inline editing functionality in tables/lists.
 * Handles edit state, saving, and visual feedback.
 * 
 * @example
 * const { editState, startEdit, save, isEditing, justSaved } = useInlineEdit({
 *   onSave: async (id, field, value) => {
 *     await supabase.from('products').update({ [field]: value }).eq('id', id);
 *   }
 * });
 */
export function useInlineEdit({
    onSave,
    feedbackDurationMs = DEBOUNCE_MS.INLINE_SAVE_FEEDBACK
}: UseInlineEditOptions): UseInlineEditReturn {
    const [editState, setEditState] = useState<InlineEditState | null>(null);
    const [savingId, setSavingId] = useState<string | null>(null);

    const startEdit = useCallback((id: string, field: string, value: string) => {
        setEditState({ id, field, value });
    }, []);

    const updateValue = useCallback((value: string) => {
        setEditState(prev => prev ? { ...prev, value } : null);
    }, []);

    const save = useCallback(async () => {
        if (!editState) return;

        setSavingId(editState.id);

        try {
            await onSave(editState.id, editState.field, editState.value);
        } finally {
            setEditState(null);
            setTimeout(() => setSavingId(null), feedbackDurationMs);
        }
    }, [editState, onSave, feedbackDurationMs]);

    const cancel = useCallback(() => {
        setEditState(null);
    }, []);

    const isEditing = useCallback((id: string, field: string) => {
        return editState?.id === id && editState?.field === field;
    }, [editState]);

    const justSaved = useCallback((id: string) => {
        return savingId === id;
    }, [savingId]);

    return {
        editState,
        savingId,
        startEdit,
        updateValue,
        save,
        cancel,
        isEditing,
        justSaved
    };
}
