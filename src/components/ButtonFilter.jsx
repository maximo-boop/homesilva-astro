import React from 'react';

const ButtonFilter = ({action, content, icon}) => {
	return (
		<button onClick={action} className="bg-white p-5 rounded-full focus:outline-none">
			<p>{content}</p>
		</button>
	);
}

export default ButtonFilter;