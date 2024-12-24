import type { PublicPathState } from 'vee-validate'

export const antConfig = ({ errors }: PublicPathState<string | number>) => {
  return {
    props: {
      validateStatus: errors[0] ? 'error' : undefined,
    },
  }
}
