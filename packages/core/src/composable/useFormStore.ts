export type Dispatch<A> = (value: A) => void;
export type Reducer<S, A> = (prevState: S, action: A) => void;
export type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<
  any,
  infer A
>
  ? A
  : never;
export type ReducerState<R extends Reducer<any, any>> = R extends Reducer<
  infer S,
  any
>
  ? S
  : never;

export default function useFormStore<R extends Reducer<any, any>>(
  reducer: R,
  initialState: ReducerState<R>,
): [ReducerState<R>, Dispatch<ReducerAction<R>>] {
  const state = initialState;
  const dispatch: Dispatch<ReducerAction<R>> = (action) => {
    reducer(state, action);
  };

  return [state, dispatch];
}
