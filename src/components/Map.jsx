import { Map as Mape, MapControls } from "@/components/ui/map";
import React from 'react';

const Map = () => {
    return (
            <div className="h-[400px] w-full bg-red-200">
		<Mape center={[2.3522, 48.8566]} zoom={11}>
			<MapControls
				position="bottom-right"
				showZoom
				showCompass
				showLocate
				showFullscreen
			/>
		</Mape>
	</div>
    );
}

export default Map;