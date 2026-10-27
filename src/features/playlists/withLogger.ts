import React from 'react';

export function withLogger<S, A extends { type: string }>(
  reducer: React.Reducer<S, A>
): React.Reducer<S, A> {
  return (prevState: S, action: A): S => {
    const nextState = reducer(prevState, action);
    if (import.meta.env.DEV) {
      console.log(`Action: ${action.type}`, {
        previousState: prevState,
        nextState,
      });
    }
    return nextState;
  };
}

