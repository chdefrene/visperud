import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import moment from 'moment';
import React, { useEffect, useState } from 'react';


const timeFormat = 'HH:mm:ss';
const timeDeltaFormat = 'mm:ss';

const GET_NEXT_ARRIVAL = gql`
    {
        stopPlace(id: "NSR:StopPlace:59634") {
            name
            estimatedCalls(numberOfDepartures: 1, whiteListed: {lines: "RUT:Line:110"}) {
                expectedArrivalTime
                serviceJourney {
                    line {
                        name
                        publicCode
                    }
                }
            }
        }
    }
`;

export default function NextArrival() {
    const { loading, error, data, refetch } = useQuery(GET_NEXT_ARRIVAL, {
        pollInterval: 10000
    });
    const [currentTime, setCurrentTime] = useState(moment());
    const [timeDiff, setTimeDiff] = useState(0);

    let arrivalTime = moment();

    useEffect(() => {
        setInterval(() => setCurrentTime(moment()),
            1000
        );
    }, []);

    useEffect(() => {
        if (currentTime < arrivalTime) {
            const delta = moment(arrivalTime - currentTime);
            setTimeDiff((delta.minutes() < 2) ? "LØP !!!" : delta.format(timeDeltaFormat));
        }
    }, [arrivalTime, currentTime]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const stopPlaceName = data.stopPlace.name;

    const nextDeparture = data.stopPlace.estimatedCalls[0];
    const lineCode = nextDeparture.serviceJourney.line.publicCode;
    const lineName = nextDeparture.serviceJourney.line.name;
    arrivalTime = moment(nextDeparture.expectedArrivalTime);

    return (
        <div>
            <h1>Holdeplass: {stopPlaceName}</h1>
            <p>Rute {lineCode}: {lineName}</p>
            <b>Nåværende tidspunkt</b>
            <p>{moment(currentTime).format(timeFormat)}</p>
            <b>Neste avgang:</b>
            <p>{moment(arrivalTime).format(timeFormat)}</p>
            <b>Tid igjen til avgang</b>
            <p>{timeDiff}</p>
            <button onClick={() => refetch()}>Refresh!</button>
        </div>
    );
}