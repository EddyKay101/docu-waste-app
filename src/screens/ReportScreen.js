import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Header from '../components/Header';
import DropDownPicker from 'react-native-dropdown-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import YearlyReports from '../components/YearlyReports';
const ReportScreen = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [options, setOptions] = useState([
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' }
    ]);
    const [yearlyWasteDataByAmount, setYearlyWasteDataByAmount] = useState([]);
    const [yearlyWasteDataByCost, setYearlyWasteDataByCost] = useState([]);
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
        <View style={styles.container} onStartShouldSetResponder={() => setOpen(false)}>
            <Header
                title="Reports"
            />
            <Spinner
                visible={spinner}
                textStyle={styles.spinnerTextStyle}
            />

            <View style={styles.dropDownContainer}>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={options}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setOptions}
                    onChangeValue={() => handleTimeLineData(value)}
                    placeholder="Timeline"
                />
            </View>
            <View style={{ height: Dimensions.get("window").height, ...styles.reportContainer }}>
                {
                    isYearly &&
                    <YearlyReports
                        setSpinner={setSpinner}
                        setYearlyWasteDataByAmount={setYearlyWasteDataByAmount}
                        yearlyWasteDataByAmount={yearlyWasteDataByAmount}
                        setYearlyWasteDataByCost={setYearlyWasteDataByCost}
                        yearlyWasteDataByCost={yearlyWasteDataByCost}
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
        padding: 10,
    },
    reportContainer: {
        top: 0,
        width: '100%',
        margin: 10
    }
})

