import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native'
import moment from 'moment';
import * as services from '../api/docu-waste';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLabel } from "victory-native";

const YearlyReports = ({ setSpinner, setYearlyWasteDataByAmount, setYearlyWasteDataByCost, yearlyWasteDataByAmount, yearlyWasteDataByCost }) => {

    const [isAmount, setIsAmount] = useState(false);
    const [isCost, setIsCost] = useState(false);

    const handleSelection = (selection) => {
        switch (selection) {
            case 'amount':
                handleGetYearlyDataByAmount();
                break;
            case 'cost':
                handleGetYearlyDataByCost();
                break;
            default:
                setIsCost(false);
                setIsAmount(false);
        }
    };
    const byAmount = obj => {
        const res = [];
        const keys = Object.keys(obj);
        keys.forEach(key => {
            res.push({
                month: key,
                amount: obj[key]
            });
        });
        return res;
    };
    const byCost = obj => {
        const res = [];
        const keys = Object.keys(obj);
        keys.forEach(key => {
            res.push({
                month: key,
                cost: obj[key]
            });
        });
        return res;
    };
    const handleGetYearlyDataByAmount = async () => {
        setSpinner(true);
        setIsAmount(true);
        setIsCost(false);
        try {
            const res = await services.waste.get();
            const sortedData = res.data.result.sort((a, b) => {
                return new Date(a.dateScanned) - new Date(b.dateScanned)
            });
            // Get month from date
            const month = sortedData.map(sd => ({ ...sd, month: moment(sd.dateScanned).format('MMM') }));

            // Get total amount by month
            const sumAmountPerMonth = month.reduce((acc, cur) => {
                acc[cur.month] = acc[cur.month] + cur.amount || cur.amount;
                return acc
            }, {});
            setYearlyWasteDataByAmount(byAmount(sumAmountPerMonth));
            setSpinner(false);

        } catch (err) {
            console.log(err);
        }
    }
    const handleGetYearlyDataByCost = async () => {
        setSpinner(true);
        setIsCost(true);
        setIsAmount(false);
        try {
            const res = await services.waste.get();
            const sortedData = res.data.result.sort((a, b) => {
                return new Date(a.dateScanned) - new Date(b.dateScanned)
            });
            // Get month from date
            const month = sortedData.map(sd => ({ ...sd, month: moment(sd.dateScanned).format('MMM') }));

            // Get total amount by month
            const sumCostPerMonth = month.reduce((acc, cur) => {
                const costToInt = parseInt(cur.cost);
                acc[cur.month] = acc[cur.month] + costToInt || costToInt;
                return acc
            }, {});
            setYearlyWasteDataByCost(byCost(sumCostPerMonth));
            setSpinner(false);

        } catch (err) {
            console.log(err);
        }
    }
    return (
        <View style={{ height: Dimensions.get("window").height, ...styles.container }}>
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
            </View>
            <View style={styles.chartContainer}>
                {
                    isAmount &&
                    <VictoryChart animate width={400} theme={VictoryTheme.material}>
                        <VictoryLabel text="By Amount" x={225} y={30} textAnchor="end" />
                        <VictoryBar data={yearlyWasteDataByAmount} x="month" y="amount" />
                    </VictoryChart>
                }
                {
                    isCost &&
                    <VictoryChart width={400} animate theme={VictoryTheme.material}>
                        <VictoryLabel text="By Cost" x={225} y={30} textAnchor="end" />
                        <VictoryBar data={yearlyWasteDataByCost} x="month" y="cost" />
                    </VictoryChart>
                }


            </View>

        </View>
    )
}

export default YearlyReports

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 20
    },
    chartContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 20
    },
    selection: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        bottom: 0
    }
})
