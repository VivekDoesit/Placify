import { useEffect, useState } from 'react'

/** Runs an async loader once on mount and tracks loading / error state. */
export default function useApi(loader) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  useEffect(() => {
    let active = true
    loader()
      .then((data) => active && setState({ data, error: null, loading: false }))
      .catch((error) => active && setState({ data: null, error: error.message, loading: false }))
    return () => { active = false }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return state
}
