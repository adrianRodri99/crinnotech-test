import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

// Hook personalizado para useDispatch con tipos
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Hook personalizado para useSelector con tipos
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
