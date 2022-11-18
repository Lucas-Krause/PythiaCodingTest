import './App.css'
import StocksWatchTable from './components/StocksWatchTable'
import { Menubar } from 'primereact/menubar'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { useState } from 'react'
import Sidebar from './components/Sidebar'

function App() {
	const [visibleSideBar, setVisibleSideBar] = useState<boolean>(true)

	return (
		<>
			<Sidebar visible={visibleSideBar} />
			<div
				className={'layout-main' + (visibleSideBar ? ' side-bar-visible' : '')}
			>
				<Menubar
					start={
						<Button
							className="no-background-button"
							icon="pi pi-bars"
							onClick={() => setVisibleSideBar(!visibleSideBar)}
						/>
					}
					end={
						<div className="flex">
							<p><strong>Lucas Alfarth Krause</strong></p>
							<Button
								className="m-1 mr-3 ml-7"
								label="Logout"
								icon="pi pi-power-off"
							/>
						</div>
					}
				/>
				<Card className="card">
					<StocksWatchTable
						stocksToSubscribe={[
							'SPY',
							'TSLA',
							'APPL',
							'AMZN',
							'MSFT',
							'META',
							'GOOG',
							'AMD',
							'INTC',
							'NVDA',
						]}
					/>
				</Card>
			</div>
		</>
	)
}

export default App
