import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native'
import moment from 'moment';
import * as services from '../api/docu-waste';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLabel, VictoryPie, VictoryLegend } from "victory-native";

const YearlyReports = ({ setSpinner, setYearlyWasteDataByAmount, setYearlyWasteDataByCost, yearlyWasteDataByAmount, yearlyWasteDataByCost, setYearlyTopFive, yearlyTopFive }) => {

    const [isAmount, setIsAmount] = useState(false);
    const [isCost, setIsCost] = useState(false);
    const [isTopFive, setIsTopFive] = useState(false);
    const [isAmountLink, setAmountLink] = useState(false);
    const [isCostLink, setCostLink] = useState(false);
    const [isTopFiveLink, setTopFiveLink] = useState(false);
    const [curYear, setYear] = useState(moment().year());
    const [selection, setSelection] = useState('');
    const componentIsMounted = useRef(true);
    useEffect(() => {

        return () => {
            componentIsMounted.current = false;
        }
    }, []);
    const handleSelection = (selection) => {
        switch (selection) {
            case 'amount':
                handleGetYearlyDataByAmount(curYear);
                break;
            case 'cost':
                handleGetYearlyDataByCost(curYear);
                break;
            case 'topFive':
                handleGetTopFive(curYear);
                break;
            default:
                setIsCost(false);
                setIsAmount(false);
                setIsTopFive(false);
        }
    };

    const handleYearSelection = (year) => {
        switch (year) {
            case moment().year():
                setYear(moment().year());
                break;
            case moment().subtract(1, 'years').year():
                setYear(moment().subtract(1, 'years').year());
                break;
            case moment().subtract(2, 'years').year():
                setYear(moment().subtract(2, 'years').year());
                break;
            default:
                setYear(null);
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
    const byProduct = obj => {
        const res = [];
        const keys = Object.keys(obj);
        keys.forEach(key => {
            res.push({
                product: key,
                amount: obj[key]
            });
        });
        return res.sort((a, b) => b.amount - a.amount).slice(0, 5);;
    };
    const handleGetYearlyDataByAmount = async (year) => {

        setSpinner(true);
        setIsCost(false);
        setIsTopFive(false);
        setIsAmount(true);

        setAmountLink(true);
        setCostLink(false);
        setTopFiveLink(false);
        try {
            const res = await services.waste.get();
            const thisYear = res.data.result.filter(a => moment(a.dateScanned).year() === year);
            const sortedData = thisYear.sort((a, b) => {
                return new Date(a.dateScanned) - new Date(b.dateScanned)
            });
            // Get month from date
            const month = sortedData.map(sd => ({ ...sd, month: moment(sd.dateScanned).format('MMM') }));

            // Get total amount by month
            const sumAmountPerMonth = month.reduce((acc, cur) => {
                acc[cur.month] = acc[cur.month] + cur.amount || cur.amount;
                return acc
            }, {});
            if (componentIsMounted.current) {

                setYearlyWasteDataByAmount(byAmount(sumAmountPerMonth));

            }
            setSpinner(false);

        } catch (err) {
            console.log(err);
        }

    }
    const handleGetYearlyDataByCost = async (year) => {

        setSpinner(true);
        setIsAmount(false);
        setIsTopFive(false);
        setIsCost(true);

        setAmountLink(false);
        setCostLink(true);
        setTopFiveLink(false);
        try {
            const res = await services.waste.get();
            const thisYear = res.data.result.filter(a => moment(a.dateScanned).year() === year);
            const sortedData = thisYear.sort((a, b) => {
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
            if (componentIsMounted.current) {

                setYearlyWasteDataByCost(byCost(sumCostPerMonth));

            }
            setSpinner(false);

        } catch (err) {
            console.log(err);
        }

    }
    const handleGetTopFive = async (year) => {
        setSpinner(true);
        setIsCost(false);
        setIsAmount(false);
        setIsTopFive(true);
        setAmountLink(false);
        setCostLink(false);
        setTopFiveLink(true);
        try {
            const res = await services.waste.get();
            const thisYear = res.data.result.filter(a => moment(a.dateScanned).year() === year);
            const sumByProduct = thisYear.reduce((acc, cur) => {
                acc[cur.product] = acc[cur.product] + cur.amount || cur.amount;

                return acc;
            }, {})
            setYearlyTopFive(byProduct(sumByProduct));
            setSpinner(false);

        } catch (err) {
            console.log(err);
        }
    }

    const handleLegend = (data, colors) => {
        const empty = [];
        colors.map(color => {
            data.map(n => {
                empty.push({
                    name: n.amount.toString(), symbol: { fill: color }
                })
            })
        });

        const filteredArr = empty.reduce((acc, current) => {
            const x = acc.find(item => item.name === current.name);
            const y = acc.find(item => item.symbol.fill === current.symbol.fill);
            if (!x && !y) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);

        return filteredArr;
    }


    return (
        <View style={{ ...styles.container }} >
            <View style={styles.headerSelection}>
                <Text style={styles.headerLabel}>Yearly Data, by Amount & Cost</Text>
                <View style={styles.selection}>
                    <View>
                        {
                            isAmountLink &&
                            <View style={styles.textBar}></View>
                        }

                        <TouchableOpacity
                            onPress={() => {
                                setSelection(() => 'amount');
                                handleSelection('amount');
                            }}
                        >
                            <Text>By Amount</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        {
                            isCostLink &&
                            <View style={styles.textBar}></View>
                        }
                        <TouchableOpacity
                            onPress={() => {
                                setSelection(() => 'cost')
                                handleSelection('cost');

                            }}
                        >
                            <Text>By Cost</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        {
                            isTopFiveLink &&
                            <View style={styles.textBar}></View>
                        }
                        <TouchableOpacity
                            onPress={() => handleSelection('topFive')}
                        >
                            <Text>Most Wasted</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
            <View style={styles.chartContainer}>
                {
                    isAmount &&
                    <VictoryChart width={400} theme={VictoryTheme.material}>
                        <VictoryLabel text="By Amount 🗑" x={225} y={30} textAnchor="end" />
                        <VictoryBar data={yearlyWasteDataByAmount} x="month" y="amount" labels={({ datum }) => `${datum.amount}`} style={{ data: { fill: '#004d40' } }} />
                    </VictoryChart>
                }
                {
                    isCost &&
                    <VictoryChart width={400} theme={VictoryTheme.material}>
                        <VictoryLabel text="By Cost 💷" x={225} y={30} textAnchor="end" />
                        <VictoryBar data={yearlyWasteDataByCost} x="month" y="cost" labels={({ datum }) => `£${datum.cost}`} style={{ data: { fill: '#004d40' } }} />
                    </VictoryChart>
                }
                {
                    isTopFive &&
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <VictoryPie
                            colorScale={["black", "#19e9b6", "#004d40", "#323232", "#616161"]}
                            data={yearlyTopFive}
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
                            data={handleLegend(yearlyTopFive, ["black", "#19e9b6", "#004d40", "#323232", "#616161"])}
                        />
                    </View>


                }


            </View>
            <View style={styles.byYearContainer}>
                <TouchableOpacity
                    onPress={() => {
                        if (selection === 'amount') {
                            handleGetYearlyDataByAmount(moment().year())
                            handleYearSelection(moment().year());
                        } else if (selection === 'cost') {
                            handleGetYearlyDataByCost(moment().year())
                            handleYearSelection(moment().year());
                        }
                    }}
                >
                    <Text style={curYear === moment().year() ? { color: '#004d40', fontWeight: 'bold', ...styles.byYearText } : styles.byYearText}>{moment().year()}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {

                        if (selection === 'amount') {
                            handleGetYearlyDataByAmount(moment().subtract(1, 'years').year());
                            handleYearSelection(moment().subtract(1, 'years').year());
                        } else if (selection === 'cost') {
                            handleGetYearlyDataByCost(moment().subtract(1, 'years').year())
                            handleYearSelection(moment().subtract(1, 'years').year());
                        }
                    }}
                >
                    <Text style={curYear === moment().subtract(1, 'years').year() ? { color: '#004d40', fontWeight: 'bold', ...styles.byYearText } : styles.byYearText}>{moment().subtract(1, 'years').year()}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {

                        if (selection === 'amount') {
                            handleGetYearlyDataByAmount(moment().subtract(2, 'years').year());
                            handleYearSelection(moment().subtract(2, 'years').year());
                        } else if (selection === 'cost') {
                            handleGetYearlyDataByCost(moment().subtract(2, 'years').year())
                            handleYearSelection(moment().subtract(2, 'years').year());
                        }
                    }}
                >
                    <Text style={curYear === moment().subtract(2, 'years').year() ? { color: '#004d40', fontWeight: 'bold', ...styles.byYearText } : styles.byYearText}>{moment().subtract(2, 'years').year()}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default YearlyReports;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1
    },
    chartContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 20
    },
    headerSelection: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 80
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
    textBar: {
        width: 40,
        backgroundColor: '#004d40',
        height: 2,
        borderRadius: 5,
        alignSelf: 'center'
    },
    byYearContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%',
        alignSelf: 'flex-end',
        right: '5%',
        marginTop: 'auto'
    },
    byYearText: {
        fontSize: 16,
    }
})
