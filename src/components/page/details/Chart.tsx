import { useCallback, useState } from 'react'
import resolveConfig from 'tailwindcss/resolveConfig'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { FiChevronDown as ChevronDown } from 'react-icons/fi'
import CustomTooltip from '@/components/page/details/CustomTooltip'
import Button from '@/components/pure/Button'
import Modal from '@/components/pure/Modal'
import formatDate from '@/util/formatDate'
import formatNumber from '@/util/formatNumber'
import tailwindConfig from '../../../../tailwind.config'

// The following 3 statements are needed in order to be able to use our Tailwind classes inside JS objects of the recharts library
const fullConfig = resolveConfig(tailwindConfig)

type ColorObject = {
  [key: string]: string
}

const singleColors = ['teal', 'red', 'mustard', 'yellow', 'orange', 'purple', 'blue', 'green']
const multiColors = ['indigo', 'gray']
const grayColors = fullConfig.theme?.colors?.gray as ColorObject

let colors: string[] = []

// Add single colors to the array
singleColors.forEach((colorName) => {
  const colorValue = fullConfig.theme?.colors?.[colorName] as string
  if (colorValue) {
    colors.push(colorValue)
  }
})

// Add multiple colors to the array
multiColors.forEach((colorName) => {
  const colorValues = fullConfig.theme?.colors?.[colorName] as ColorObject
  if (colorValues) {
    colors = [...colors, ...Object.values(colorValues)]
  }
})

const TimeframeOptions = [
  { value: 1, label: '1 Month' },
  { value: 3, label: '3 Months' },
  { value: 6, label: '6 Months' },
  { value: 12, label: '1 Year' }
]

type ChartProps = {
  datasets: {
    id: string
    name: string
    data: {
      date: string
      count: number
    }[]
  }[]
}

type DataPoint = {
  date: string
  count: number
}

const filterDataByTimeframe = (data: DataPoint[], months: number) => {
  const now = new Date()
  const pastDate = now.setMonth(now.getMonth() - months)
  return data.filter((d) => new Date(d.date).getTime() >= pastDate)
}

const Chart = ({ datasets }: ChartProps) => {
  const [modalValue, setModalValue] = useState('Select Value')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [timeframeModalOpen, setTimeframeModalOpen] = useState(false)
  const [timeframeModalValue, setTimeframeModalValue] = useState('Select timeframe')

  const [chartDataOriginal] = useState<ChartProps['datasets']>([...datasets])
  const [chartData, setChartData] = useState(chartDataOriginal)

  const [isDataNormalized, setIsDataNormalized] = useState(false)

  const handleDataNormalization = () => {
    if (isDataNormalized) {
      setChartData(chartDataOriginal)
      setIsDataNormalized(false)
      return
    }
    setIsDataNormalized(true)
    const earliestDate = Math.min(
      ...datasets.flatMap((dataset) => dataset.data.map((point) => new Date(point.date).getTime()))
    )

    const normalizedData = chartData.map((dataset) => ({
      ...dataset,
      data: dataset.data.map((point) => ({
        ...point,
        date: new Date(
          new Date(point.date).getTime() -
            (Math.min(...dataset.data.map((p) => new Date(p.date).getTime())) - earliestDate)
        ).toISOString()
      }))
    }))

    setChartData(normalizedData)
  }

  const toggleModal = useCallback(() => {
    setIsModalOpen((prevState) => !prevState)
  }, [])

  const handleModalValueChange = useCallback((newValue: string) => {
    setModalValue(newValue)
    setIsModalOpen(false)
  }, [])

  const handleTimeframeChange = useCallback(
    (newTimeframe: number) => {
      const selectedOption = TimeframeOptions.find((option) => option.value === newTimeframe)
      setTimeframeModalValue(selectedOption ? selectedOption.label : TimeframeOptions[0].label)
      setTimeframeModalOpen(false)

      const filteredData = chartDataOriginal.map((dataset) => ({
        ...dataset,
        data: filterDataByTimeframe(dataset.data, newTimeframe)
      }))

      setChartData(filteredData)
    },
    [chartData]
  )

  return (
    <div className="flex w-full flex-row px-7 py-8">
      {datasets.length === 0 ? (
        <p>No data</p>
      ) : (
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-row gap-3 ">
            <div className="flex flex-col">
              <Button
                variant="normal"
                text={modalValue}
                Icon={ChevronDown}
                order="rtl"
                fullWidth
                onClick={() => {
                  toggleModal()
                }}
              />

              <Modal isOpen={isModalOpen} onClose={toggleModal}>
                {['Stars', 'Forks', 'Contributors'].map((item) => (
                  <Button
                    key={item}
                    variant="noBorderNoBG"
                    text={item}
                    fullWidth
                    onClick={() => handleModalValueChange(item)}
                  />
                ))}
              </Modal>
            </div>

            <div className="flex flex-col">
              <Button
                variant="normal"
                text={timeframeModalValue}
                Icon={ChevronDown}
                order="rtl"
                onClick={() => {
                  setTimeframeModalOpen(true)
                }}
              />

              <Modal isOpen={timeframeModalOpen} onClose={() => setTimeframeModalOpen(false)}>
                {TimeframeOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant="noBorderNoBG"
                    text={option.label}
                    fullWidth
                    onClick={() => handleTimeframeChange(option.value)}
                  />
                ))}
              </Modal>
            </div>
            <div>
              <Button
                variant="normal"
                text="Normalize Data"
                fullWidth
                onClick={handleDataNormalization}
              />
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              height={300}
              margin={{
                top: 25,
                right: 10,
                left: -25,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={grayColors['800']} />

              <XAxis
                dataKey="date"
                type="number"
                tick={{ fontSize: '12', fontWeight: 'light' }}
                tickFormatter={formatDate}
                stroke={grayColors['500']}
                allowDataOverflow
                domain={['dataMin', 'dataMax']}
              />

              <YAxis
                label={{ value: 'Stars', dy: -125, dx: 25, fontSize: '12', fill: 'gray' }}
                tick={{ fontSize: '12', fontWeight: 'light' }}
                stroke={grayColors['500']}
                tickFormatter={formatNumber}
                domain={[0, 'dataMax']}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: grayColors['100'], strokeWidth: 1 }}
              />

              <Legend wrapperStyle={{ fontSize: '12px' }} />

              {chartData.map((dataset, index) => (
                <Line
                  key={dataset.id}
                  data={dataset.data.map((item) => ({
                    ...item,
                    date: new Date(item.date).getTime()
                  }))}
                  dataKey="count"
                  name={dataset.name}
                  type="monotone"
                  stroke={colors[index % colors.length]}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default Chart
