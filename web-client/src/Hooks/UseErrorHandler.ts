import {useEffect} from "react";

export default function useErrorHandler(error: string) {
 useEffect(() => {
  if (error) throw new Error(error);
 }, [error])
}
