import rootLogger from "logger"
import { recordUsageReport } from "models/db"
const logger = rootLogger.getLogger("report")
const codes = [ // https://github.com/wpilibsuite/ni-libraries/blob/0be7f5385b3a80a86a0b50ddbf64c85026bf8a08/src/include/FRC_NetworkCommunication/UsageReporting.h
    "Controller",
    "Module",
    "Language",
    "CANPlugin",
    "Accelerometer",
    "ADXL345",
    "AnalogChannel",
    "AnalogTrigger",
    "AnalogTriggerOutput",
    "CANJaguar",
    "Compressor", // 10
    "Counter",
    "Dashboard",
    "DigitalInput",
    "DigitalOutput",
    "DriverStationCIO",
    "DriverStationEIO",
    "DriverStationLCD",
    "Encoder",
    "GearTooth",
    "Gyro", // 20
    "I2C",
    "Framework",
    "Jaguar",
    "Joystick",
    "Kinect",
    "KinectStick",
    "PIDController",
    "Preferences",
    "PWM",
    "Relay", // 30
    "RobotDrive",
    "SerialPort",
    "Servo",
    "Solenoid",
    "SPI",
    "Task",
    "Ultrasonic",
    "Victor",
    "Button",
    "Command", // 40
    "AxisCamera",
    "PCVideoServer",
    "SmartDashboard",
    "Talon",
    "HiTechnicColorSensor",
    "HiTechnicAccel",
    "HiTechnicCompass",
    "SRF08",
    "AnalogOutput",
    "VictorSP", // 50
    "PWMTalonSRX",
    "CANTalonSRX",
    "ADXL362",
    "ADXRS450",
    "RevSPARK",
    "MindsensorsSD540",
    "DigitalGlitchFilter",
    "ADIS16448",
    "PDP",
    "PCM", // 60
    "PigeonIMU",
    "NidecBrushless",
    "CANifier",
    "TalonFX",
    "CTRE_future1",
    "CTRE_future2",
    "CTRE_future3",
    "CTRE_future4",
    "CTRE_future5",
    "CTRE_future6", // 70
    "LinearFilter",
    "XboxController",
    "UsbCamera",
    "NavX",
    "Pixy",
    "Pixy2",
    "ScanseSweep",
    "Shuffleboard",
    "CAN",
    "DigilentDMC60", // 80
    "PWMVictorSPX",
    "RevSparkMaxPWM",
    "RevSparkMaxCAN",
    "ADIS16470",
    "PIDController2",
    "ProfiledPIDController",
    "Kinematics",
    "Odometry",
    "Units",
    "TrapezoidProfile", // 90
    "DutyCycle",
    "AddressableLEDs",
    "FusionVenom",
    "CTRE_future7",
    "CTRE_future8",
    "CTRE_future9",
    "CTRE_future10",
    "CTRE_future11",
    "CTRE_future12",
    "CTRE_future13", // 100
    "CTRE_future14",
] as const



interface DecodedEntry {
    instance?: number
    context?: number
    feature?: string
}

export type UsageReportingOutput = Partial<{ [key in UsageReportingKeys]: string | number }>
export type UsageReportingKeys = typeof codes[number]
type DecodedReport = Partial<{
    [key in UsageReportingKeys]: DecodedEntry[]
}>



function getReportKey(key:string):UsageReportingKeys {
    function getReportKeyIndex(key: string): number {
        if (key.startsWith(">")) {
            return getReportKeyIndex('z') + 1 + getReportKeyIndex(key.substring(1))
        }
        if (key.charCodeAt(0) >= 65 && key.charCodeAt(0) <= 90) { // capital
            return key.charCodeAt(0) - 65
        } else
        if (key.charCodeAt(0) >= 97 && key.charCodeAt(0) <= 122) { // lowercase
            return key.charCodeAt(0) - (65+6) // account for random characters that some idiot put in the middle of the alphabet 
        }
    }
    return codes[getReportKeyIndex(key)]
}

function decode(data: string): DecodedReport {
    const result = data.matchAll(/(>?[A-z])(\d+)(?:\:(\d+))?(?:\((.+)\))?/g)
    let output: DecodedReport = {}
    for (const entry of result) {
        const [_, letter, instance, context, feature] = entry
        const resource = getReportKey(letter)
        
        if (resource == null) {
            console.log(letter,)
        }
        output[resource] ??= []
        output[resource].push({
            instance: parseOptionalInt(instance),
            context: parseOptionalInt(context),
            feature: feature ?? null
        })
    }
    return output
}

function parseOptionalInt(data: string): number | null {
    const parsed = parseInt(data)
    return isNaN(parsed) ? null : parsed
}
const maps: Partial<{ [key in UsageReportingKeys]: { [key: number]: string } }> = {
    "Language": {
        1: "LabVIEW",
        2: "C++",
        3: "Java",
        4: "Python",
        5: "DotNet",
        6: "Kotlin"
    },
    "CANPlugin": {
        1: "BlackJagBridge",
        2: "2CAN",
    },
    "Framework": {
        1: "Iterative",
        2: "Simple",
        3: "Command and Control",
        4: "Timed",
        5: "ROS",
        6: "RobotBuilder",
    },
    "RobotDrive": {
        1: "ArcadeStandard",
        2: "ArcadeButtonSpin",
        3: "ArcadeRatioCurve",
        4: "Tank",
        5: "MecanumPolar",
        6: "MecanumCartesian",
        7: "DifferentialArcade",
        8: "DifferentialTank",
        9: "DifferentialCurvature",
        10: "MecanumCartesian",
        11: "MecanumPolar",
        12: "KilloughCartesian",
        13: "KilloughPolar",
    },
    "DriverStationCIO": {
        1: "Analog",
        2: "DigitalIn",
        3: "DigitalOut",
    },
    "DriverStationEIO": {
        1: "Acceleration",
        2: "AnalogIn",
        3: "AnalogOut",
        4: "Button",
        5: "LED",
        6: "DigitalIn",
        7: "DigitalOut",
        8: "FixedDigitalOut",
        9: "PWM",
        10: "Encoder",
        11: "TouchSlider",
    },
    "ADXL345": {
        1: "SPI",
        2: "I2C",
    },
    "Command": {
        1:"Scheduler",
        2:"Scheduler 2"
    },
    "Kinematics": {
        1:"DifferentialDrive",
        2:"MecanumDrive",
        3:"SwerveDrive",
    },
    "Odometry": {
        1:"DifferentialDrive",
        2:"MecanumDrive",
        3:"SwerveDrive",
    }
    
    
}




function formatReport(report: DecodedReport) {
    const output: Partial<{ [key in UsageReportingKeys]: string | number }> = {}
    for (const [key, entries] of Object.entries(report)) {
        if (maps[key] != null) {
            output[key] = entries.map(entry => maps[key][entry.instance!]).join(", ")
        } else {
            output[key] = entries.length
        }
        
        const featureInfo = entries.map(entry => entry.feature).filter(feature => feature != null).join(", ")
        if (featureInfo != "") {
            output[key] += " (" + featureInfo+")"
        }
    }
    return output
}

export function handleUsageReport(team: number, data: string) {
    const formatted = formatReport(decode(data))
    logger.log("received usage report for", team)
    recordUsageReport(team, data, formatted)
}
