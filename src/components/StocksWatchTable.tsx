/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from 'react'
import protobuf from 'protobufjs'
import '../App.css'
import { decode } from 'base64-arraybuffer'
import { StockInfo } from '../types/StockInfo'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import {
	formatDayVolume,
	formatToCurrency,
	formatToPercentage,
} from '../helpers/Formaters'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
	selectLastStocksData,
	selectStocksData,
	updateLastStocksData,
	updateStocksData,
} from '../features/stocksData/StocksDataSlice'

interface StocksWatchTableProps {
	stocksToSubscribe: string[]
}

const StocksWatchTable: FC<StocksWatchTableProps> = ({ stocksToSubscribe }) => {
	const stocksData: StockInfo[] = useAppSelector(selectStocksData)
	const lastStocksData: StockInfo[] = useAppSelector(selectLastStocksData)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (stocksToSubscribe.length > 0) {
			const yahooWebSocket = new WebSocket('wss://streamer.finance.yahoo.com')
			protobuf.load('../YPricingData.proto', (error, root) => {
				if (error || !root) {
					return console.log(error)
				}

				const yahooStockType = root.lookupType('YahooStockType')

				yahooWebSocket.onopen = () => {
					yahooWebSocket.send(JSON.stringify({ subscribe: stocksToSubscribe }))
				}

				yahooWebSocket.onmessage = (messageData) => {
					const yahooStockInfo: any = yahooStockType.decode(
						new Uint8Array(decode(messageData.data))
					)

					const stockInfo: StockInfo = {
						change: yahooStockInfo.change,
						changePercent: yahooStockInfo.changePercent,
						exchange: yahooStockInfo.exchange,
						id: yahooStockInfo.id,
						marketHours: yahooStockInfo.marketHours,
						price: yahooStockInfo.price,
						priceHint: yahooStockInfo.priceHint,
						quoteType: yahooStockInfo.quoteType,
						time: yahooStockInfo.time,
						dayVolume: yahooStockInfo.dayVolume || '0',
						lastSize: yahooStockInfo.lastSize || '0',
					}

					dispatch(updateStocksData(stockInfo))
				}
			})
		}
	}, [stocksToSubscribe])

	function renderHeader() {
		return (
			<div className="flex justify-content-between align-items-center">
				<h1 className="m-0">Stocks Watchlist </h1>
			</div>
		)
	}

	useEffect(() => {
		setTimeout(() => {
			dispatch(updateLastStocksData(stocksData))
		}, 5)
	}, [stocksData])

	function getTextClassName(value: number) {
		let className = ''

		if (value > 0) {
			className = 'green-text'
		}

		if (value < 0) {
			className = 'red-text'
		}

		return className
	}

	function getBackgroundClassName(
		stockInfo: StockInfo,
		valueName: 'price' | 'change' | 'changePercent' | 'dayVolume',
		formatFunction: Function
	) {
		let className = ''

		const lastStock = lastStocksData.find(
			(lastStockInfo) => lastStockInfo.id === stockInfo.id
		)

		const formattedValue = formatFunction(Number(stockInfo[valueName]))

		if (lastStock && lastStock[valueName]) {
			const formattedLastValue = formatFunction(Number(lastStock[valueName]))

			if (formattedValue !== formattedLastValue) {
				className = 'background-green'

				if (typeof formattedValue === 'string') {
					if (Number(lastStock[valueName]) - Number(stockInfo[valueName]) > 0) {
						className = 'background-red'
					}
				} else {
					if (formattedLastValue - formattedValue > 0) {
						className = 'background-red'
					}
				}
			}
		}

		return className
	}

	return (
		<div>
			<div className="card">
				<DataTable
					value={stocksData}
					className="p-datatable-customers"
					header={renderHeader()}
					filterDisplay="menu"
					emptyMessage="Couldn't find any changes to the stocks"
				>
					<Column
						field="id"
						header="Symbol"
						sortable
						style={{ maxWidth: '13rem' }}
					/>
					<Column
						field="price"
						header="price"
						sortable
						body={(stock: StockInfo) => {
							const className = getBackgroundClassName(
								stock,
								'price',
								formatToCurrency
							)

							return (
								<div>
									<span className={className + ' flashing-span'}>
										{formatToCurrency(stock.price)}
									</span>
								</div>
							)
						}}
						style={{ maxWidth: '13rem' }}
					/>
					<Column
						field="change"
						header="Change"
						sortable
						body={(stock: StockInfo) => {
							const containerClassName = getTextClassName(stock.change)

							const spanClassName = getBackgroundClassName(
								stock,
								'change',
								formatToCurrency
							)

							return (
								<div className={containerClassName}>
									<span className={spanClassName + ' flashing-span'}>
										{stock.change > 0 && '+'}
										{formatToCurrency(stock.change)}
									</span>
								</div>
							)
						}}
						style={{ maxWidth: '13rem' }}
					/>
					<Column
						field="changePercent"
						header="Change (%)"
						sortable
						body={(stock: StockInfo) => {
							const containerClassName = getTextClassName(stock.changePercent)

							const spanClassName = getBackgroundClassName(
								stock,
								'changePercent',
								formatToPercentage
							)

							return (
								<div className={containerClassName}>
									<span className={spanClassName + ' flashing-span'}>
										{stock.changePercent > 0 && '+'}
										{formatToPercentage(stock.changePercent)}
									</span>
								</div>
							)
						}}
						style={{ maxWidth: '13rem' }}
					/>
					<Column
						field="dayVolume"
						header="Volume"
						sortable
						body={(stock: StockInfo) => {
							const spanClassName = getBackgroundClassName(
								stock,
								'dayVolume',
								formatDayVolume
							)

							return (
								<div>
									<span className={spanClassName + ' flashing-span'}>
										{formatDayVolume(Number(stock.dayVolume) || 0)}M
									</span>
								</div>
							)
						}}
						style={{ maxWidth: '13rem' }}
					/>
					<Column
						field="time"
						header="Timestamp"
						sortable
						body={(stock) =>
							`${new Date(stock.time).toLocaleDateString()} - ${new Date(
								stock.time
							).toLocaleTimeString()}`
						}
						style={{ maxWidth: '13rem' }}
					/>
				</DataTable>
			</div>
		</div>
	)
}

export default StocksWatchTable
