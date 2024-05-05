import React, { useEffect, useState, useRef } from "react";

function is_cached(src) {
	var image = new Image();
	image.src = src;

	return image.complete;
}

export default function FadeInImage(props) {
	const [loaded, setLoaded] = useState([true, false]);
    const image = useRef()

    useEffect(() => {
        if (image.current.complete)
            setLoaded([true, true])
        else
            setLoaded([false, false])
    }, [])

	return (
		<img
			{...props}
			lazy={"true"}
            ref={image}
			onLoad={() => setLoaded([true, loaded[1]])}
			style={{
				opacity: loaded[0] || loaded[1] ? 1 : 0,
				transition: !loaded[1] ? ("opacity 0.25s ease-in-out") : undefined,
                ...props.style
			}}
		/>
	);
}
