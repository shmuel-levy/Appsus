const { useState } = React

export function LongTxt({ txt, length = 100 }) {
    const [isShowMore, setIsShowMore] = useState(false)

    function handleClick() {
        setIsShowMore(prev => !prev)
    }

    function getTxtToShow() {
        if (txt.length < length) return txt
        return isShowMore ? txt : txt.substring(0, length) + '...'
    }

    if (txt.length < length) return <span>{txt}</span>

    return (
        <span>
            {getTxtToShow()}
            {txt.length > length &&
                <span 
                    className="read-more" 
                    onClick={handleClick}
                >
                    {isShowMore ? ' Read Less' : ' Read More'}
                </span>
            }
        </span>
    )
}