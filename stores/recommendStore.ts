import { create } from "zustand";
import { IntervalPlan, SoundOption, WorkoutContext } from "../types/interval";
import { getIntervalRecommendation } from "../services/claude";

interface RecommendState {
  plan: IntervalPlan | null;
  loading: boolean;
  error: string | null;
  soundOption: SoundOption;
  setSoundOption: (option: SoundOption) => void;
  fetchRecommendation: (context: WorkoutContext) => Promise<void>;
  reset: () => void;
}

export const useRecommendStore = create<RecommendState>((set) => ({
  plan: null,
  loading: false,
  error: null,
  soundOption: "none",
  setSoundOption: (option) => set({ soundOption: option }),

  fetchRecommendation: async (context) => {
    set({ loading: true, error: null });
    try {
      const plan = await getIntervalRecommendation(context);
      set({ plan, loading: false });
    } catch {
      set({ error: "추천을 가져오는데 실패했습니다.", loading: false });
    }
  },

  reset: () => set({ plan: null, error: null, loading: false }),
}));
