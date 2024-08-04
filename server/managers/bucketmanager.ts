import {BucketPattern, ClientToServerEvents, DriverStation, ServerToClientEvents} from '~common/types';
import rootLogger from '~/logger';
import {Socket} from 'socket.io';

const logger = rootLogger.getLogger("bucket")
const buckets:{[key in DriverStation]:Socket<ClientToServerEvents, ServerToClientEvents>|null} = {
    R1: null,
    R2: null,
    R3: null,
    B1: null,
    B2: null,
    B3: null
}

export function registerBucket(station:DriverStation, socket:Socket<ClientToServerEvents, ServerToClientEvents>) {
    logger.log("registering bucket", station)
    if  (buckets[station] != null) {
        logger.warn("bucket already registered for station", station)
        setPattern(station, BucketPattern.RED_ALLIANCE) // TODO: make a more explicit error pattern
        buckets[station].disconnect(true)
    }
    buckets[station] = socket
    if (station.startsWith("B")) {
        setPattern(station, BucketPattern.BLUE_ALLIANCE)
    } else {
        setPattern(station, BucketPattern.RED_ALLIANCE)
    }
}

export function setPattern(station:DriverStation, pattern:BucketPattern) {
    const bucket = buckets[station]
    if (bucket == null) {
        logger.warn("no bucket for station", station)
        return
    }
    bucket.emit("setBucketState", pattern)
}

export function setPatternAll(pattern:BucketPattern) {
    for (const station in buckets) {
        setPattern(station as DriverStation, pattern)
    }
}