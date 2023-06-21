import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser, useSessionContext } from '@supabase/auth-helpers-react'
import Loading from '@/components/pure/Loading'
/**
 * HOC for pages that require authentication
 */
export default function withAuth<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: React.ComponentType<P>
) {
  return (props: React.PropsWithChildren<P>) => {
    const { isLoading, error } = useSessionContext()
    const router = useRouter()
    const user = useUser()

    useEffect(() => {
      if (error || (!isLoading && !user)) {
        void router.replace('/login/error')
      }
    }, [error, isLoading, user])

    if (isLoading || !user) return <Loading />

    return React.createElement(WrappedComponent, props)
  }
}
