import { create } from 'zustand';

type TemplateState = {
  value: string;
};

type TemplateActions = {
  setValue: (value: string) => void;
  reset: () => void;
};

type TemplateStore = TemplateState & TemplateActions;

const initialState: TemplateState = {
  value: '',
};

export const useTemplateStore = create<TemplateStore>((set) => ({
  ...initialState,
  setValue: (value) => set({ value }),
  reset: () => set(initialState),
}));
