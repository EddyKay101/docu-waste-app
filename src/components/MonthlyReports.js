import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import moment from 'moment';
import * as services from '../api/docu-waste';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLabel, VictoryPie, VictoryLegend, VictoryGroup } from "victory-native";
import DropDownPicker from 'react-native-dropdown-picker';
const MonthlyReports = ({ setSpinner, setMonthlyWasteDataByAmount, setMonthlyWasteDataByCost, monthlyWasteDataByAmount, monthlyWasteDataByCost, setMonthlyTopFive, monthlyTopFive, monthOpen, setTimelineOpen }) => {

    const [isAmount, setIsAmount] = useState(false);
    const [isCost, setIsCost] = useState(false);
    const [isTopFive, setIsTopFive] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [hasValue, setHasValue] = useState(false);
    const [options, setOptions] = useState([
        { label: 'Jan', value: 'jan' },
        { label: 'Feb', value: 'feb' },
        { label: 'Mar', value: 'mar' },
        { label: 'Apr', value: 'apr' },
        { label: 'May', value: 'may' },
        { label: 'Jun', value: 'jun' },
        { label: 'Jul', value: 'jul' },
        { label: 'Aug', value: 'aug' },
        { label: 'Sep', value: 'sep' },
        { label: 'Oct', value: 'oct' },
        { label: 'Nov', value: 'nov' },
        { label: 'Dec', value: 'dec' }
    ]);
    const handleSelection = (selection) => {
        switch (selection) {
            case 'amount':
                handleGetMonthlyDataByAmount();
                break;
            case 'cost':
                handleGetMonthlyDataByCost();
                break;
            case 'topFive':
                handleGetTopFive();
                break;
            default:
                setIsCost(false);
                setIsAmount(false);
                setIsTopFive(false);
        }
    };
    const byAmount = obj => {
        const wk = [1, 2, 3, 4, 5];
        const keys = Object.keys(obj);
        const oldArr = keys.map(key => {
            const keyToInt = parseInt(key);
            if (wk.includes(keyToInt)) {
                const index = wk.indexOf(keyToInt);
                if (index > -1) {
                    wk.splice(index, 1);
                }
            }
            return {
                week: `wk${key}`,
                amount: obj[key],
                fill: 'red'
            }
        });
        const newArr = wk.map(w => {
            return {
                week: `wk${w}`,
                amount: 0
            }
        });
        const combined = [...oldArr, ...newArr];
        combined.map(c => {
            if (c.week === 'wk5' && c.amount === 0) {
                const index = combined.indexOf(c);
                if (index > -1) {
                    combined.splice(index, 1);
                }
            }
        })
        return combined.sort((a, b) => a.week.localeCompare(b.week))
    };

    const handleGetMonthlyDataByAmount = async (month) => {
        setSpinner(true);
        setIsAmount(true);
        setIsCost(false);
        setIsTopFive(false);
        try {
            const res = await services.waste.get();
            if (res.data.result) {
                setHasValue(true);
                const week = res.data.result.map(data => ({ ...data, week: Math.floor((moment(data.dateScanned).date() - 1) / 7) + 1 }));
                let dataForMonth = [];
                let total;
                week.map(data => {
                    if (moment(data.dateScanned).format("MMM").toUpperCase() === month.toUpperCase()) {
                        dataForMonth.push(data);
                        const totalPerWeek = dataForMonth.reduce((acc, cur) => {
                            acc[cur.week] = acc[cur.week] + cur.amount || cur.amount;
                            return acc;
                        }, {});
                        total = totalPerWeek;
                    }
                });
                const amt = byAmount(total);
                setMonthlyWasteDataByAmount(amt);
                setSpinner(false);
            } else {
                setHasValue(false);
            }



        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View style={{ ...styles.container }}>
            <View style={styles.headerSelection}>
                <Text style={styles.headerLabel}>Monthly Data, By Amount & Cost</Text>

                <DropDownPicker
                    open={open}
                    value={value}
                    items={options}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setOptions}
                    onChangeValue={() => {
                        handleGetMonthlyDataByAmount(value)
                    }}
                    placeholder="Month"
                    dropDownContainerStyle={{
                        width: '50%',
                        marginLeft: 20,
                        top: 70,
                        zIndex: 1000
                    }}
                    zIndex={open ? 9000 : 1000}
                    style={styles.dropDownContainer}
                />

                <View style={styles.selection}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleSelection('amount')}
                    >
                        <Text>By Amount</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleSelection('cost')}
                    >
                        <Text>By Cost</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleSelection('topFive')}
                    >
                        <Text>Top 5 Wastage</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.chartContainer}>
                {
                    isAmount &&
                    <VictoryChart animate width={400} theme={VictoryTheme.material}>

                        <VictoryLabel text="By Amount" x={225} y={30} textAnchor="end" />
                        <VictoryBar
                            data={monthlyWasteDataByAmount} x="week" y="amount" labels={({ datum }) => `${datum.amount}`} />

                    </VictoryChart>


                }
                {
                    isCost &&
                    <VictoryChart width={400} animate theme={VictoryTheme.material}>
                        <VictoryLabel text="By Cost" x={225} y={30} textAnchor="end" />
                        <VictoryBar data={monthlyWasteDataByCost} x="month" y="cost" />
                    </VictoryChart>
                }
                {
                    isTopFive &&
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <VictoryPie
                            colorScale={["tomato", "orange", "gold", "cyan", "navy"]}
                            data={monthlyTopFive}
                            x={`product`}
                            y="amount"
                            style={{ labels: { fontSize: 10, fontWeight: "bold" } }}
                            animate
                            width={350}
                            labelPosition="centroid"
                            labelPlacement="perpendicular"
                        />
                        <VictoryLegend x={50} y={2}
                            centerTitle
                            orientation="horizontal"
                            gutter={20}
                            data={handleLegend(monthlyTopFive, ["tomato", "orange", "gold", "cyan", "navy"])}
                        />
                    </View>


                }


            </View>

        </View >
    )
}

export default MonthlyReports

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    chartContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 60

    },
    headerSelection: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 80,
        zIndex: 10
    },
    selection: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        bottom: 0
    },
    headerLabel: {
        textAlign: 'center',
        fontSize: 20
    },
    dropDownContainer: {
        width: '50%',
        top: 0,
        margin: 20,
        zIndex: 1000
    },
})
