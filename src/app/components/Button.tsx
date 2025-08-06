'use client';

interface ButtonProps {
    house: string;
    count: number;
}

export default function house_card({ house: house_card, count }: ButtonProps) {
    return (
        <div className="house-card">
            <h2>{house_card}</h2>
            <p>Points: {count}</p>
            <button>Show Events For House</button>
        </div>
    );
}
