import { ComponentType } from 'react'

type GitHubMetricIconProps = {
  Icon: ComponentType<{ className?: string }>
  Icon2: ComponentType<{ className?: string }>
}

const GitHubMetricIcon = ({ Icon, Icon2 }: GitHubMetricIconProps) => (
  <div className="relative h-4 w-4">
    <Icon className="absolute left-0 top-0 z-10 h-2 w-2 text-gray-500" />
    <div
      className="absolute mb-[3px] ml-[3px] h-[1px] w-3 origin-bottom-left -rotate-45 rounded-full bg-gray-500"
      style={{ bottom: '0', left: '0' }}
    />
    <Icon2 className="absolute bottom-0 right-0 z-10 h-2 w-2 text-gray-500" />
  </div>
)

export default GitHubMetricIcon