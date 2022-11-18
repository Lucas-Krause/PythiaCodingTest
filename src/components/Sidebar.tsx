import { FC } from 'react'
import StocksWatchlistAppIcon from '../StocksWatchlistAppIcon.svg'

interface SidebarProps {
	visible: boolean
	children?: React.ReactNode
}

const Sidebar: FC<SidebarProps> = ({ visible, children }) => {
	return (
		<div className={'sidebar' + (visible ? ' sidebar-active' : '')}>
			<div className="layout-logo mt-4">
				<img src={StocksWatchlistAppIcon} alt="" />
			</div>
			{children}
		</div>
	)
}

export default Sidebar
