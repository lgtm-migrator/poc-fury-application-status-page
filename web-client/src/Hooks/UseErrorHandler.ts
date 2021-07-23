import {useEffect} from "react";

// This function is needed to catch async throws in Error Boundary
export default function useErrorHandler(error: string) {
 useEffect(() => {
  if (error) throw new Error(error);
 }, [error])
}
