import { ComponentProps } from 'react'
import GithubStatItem from '@/components/Sidebar/Box/GithubStatItem'

type InformationRowProps = {
  githubStats: ({ id: ID } & ComponentProps<typeof GithubStatItem>)[]
  name: string
  tags: { id: ID; name: string }[]
}

const InformationRow = ({ githubStats, name, tags }: InformationRowProps) => (
  <div className="flex flex-row items-center p-2 text-14 font-normal transition-colors duration-100 hover:bg-gray-850">
    <h1 className="text-14">{name}</h1>
    {tags.map(({ id, name: tagName }) => (
      <span
        key={id}
        className="mx-1 block rounded-lg bg-gray-850 px-2 py-0.5 text-12 font-light text-gray-300"
      >
        {tagName}
      </span>
    ))}
    {githubStats.map((data) => (
      <GithubStatItem
        key={data.id}
        Icon={data.Icon}
        IconMetric={data.IconMetric}
        value={data.value}
        growth={data.growth}
        paddingOn={false}
        hoverOn={false}
      />
    ))}
  </div>
)

export default InformationRow
