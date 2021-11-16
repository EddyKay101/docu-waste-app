import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Header from '../components/Header';
import DropDownPicker from 'react-native-dropdown-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import YearlyReports from '../components/YearlyReports';
import MonthlyReports from '../components/MonthlyReports';
const ReportScreen = () => {
    const [timeLineOpen, setTimelineOpen] = useState(false);
    const [monthOpen, setMonthOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [options, setOptions] = useState([
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' }
    ]);
    const [yearlyWasteDataByAmount, setYearlyWasteDataByAmount] = useState([]);
    const [monthlyWasteDataByAmount, setMonthlyWasteDataByAmount] = useState([]);
    const [yearlyWasteDataByCost, setYearlyWasteDataByCost] = useState([]);
    const [monthlyWasteDataByCost, setMonthlyWasteDataByCost] = useState([]);
    const [yearlyTopFive, setYearlyTopFive] = useState([]);
    const [monthlyTopFive, setMonthlyTopFive] = useState([]);
    const [isYearly, setIsYearly] = useState(false);
    const [isMonthly, setIsMonthly] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const handleTimeLineData = (value) => {
        switch (value) {
            case 'yearly':
                setIsYearly(true);
                setIsMonthly(false);
                break;
            case 'monthly':
                setIsMonthly(true);
                setIsYearly(false);
                break;
            default:
                setIsYearly(false);
                setIsMonthly(false);
        }
    }
    return (
        <View style={styles.container} onStartShouldSetResponder={() => setTimelineOpen(false)}>
            <Header
                title="Reports"
            />
            <Spinner
                visible={spinner}
                textStyle={styles.spinnerTextStyle}
            />


            <DropDownPicker
                open={timeLineOpen}
                value={value}
                items={options}
                setOpen={setTimelineOpen}
                setValue={setValue}
                setItems={setOptions}
                onChangeValue={() => {
                    handleTimeLineData(value)
                }}
                placeholder="Timeline"
                dropDownContainerStyle={{
                    width: '90%',
                    alignSelf: 'center',
                    top: 169
                }}
                zIndex={timeLineOpen ? 9000 : 1000}
                style={styles.dropDownContainer}
            />

            <View style={{ height: Dimensions.get("window").height, ...styles.reportContainer }}>
                {
                    isYearly &&
                    <YearlyReports
                        setSpinner={setSpinner}
                        setYearlyWasteDataByAmount={setYearlyWasteDataByAmount}
                        yearlyWasteDataByAmount={yearlyWasteDataByAmount}
                        setYearlyWasteDataByCost={setYearlyWasteDataByCost}
                        yearlyWasteDataByCost={yearlyWasteDataByCost}
                        setYearlyTopFive={setYearlyTopFive}
                        yearlyTopFive={yearlyTopFive}
                    />
                }
                {
                    isMonthly &&
                    <MonthlyReports
                        setTimelineOpen={setTimelineOpen}
                        monthOpen={monthOpen}
                        setSpinner={setSpinner}
                        setMonthlyWasteDataByAmount={setMonthlyWasteDataByAmount}
                        monthlyWasteDataByAmount={monthlyWasteDataByAmount}
                    />
                }
            </View>

        </View>
    )
}

export default ReportScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    dropDownContainer: {
        marginTop: 120,
        alignSelf: 'center',
        width: '90%',
        top: 0

    },
    reportContainer: {
        top: 0,
        width: '100%',
        margin: 10,
        flex: 3,
        zIndex: -1000
    }
})


