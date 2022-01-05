import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import moment from 'moment';
import * as services from '../api/docu-waste';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLabel, VictoryPie, VictoryLegend } from "victory-native";
import DropDownPicker from 'react-native-dropdown-picker';
const MonthlyReports = ({ setSpinner, setMonthlyWasteDataByAmount, setMonthlyWasteDataByCost, monthlyWasteDataByAmount, monthlyWasteDataByCost, setMonthlyTopFive, monthlyTopFive, onChildDropdownOpen }) => {

    const [isAmount, setIsAmount] = useState(false);
    const [isCost, setIsCost] = useState(false);
    const [isTopFive, setIsTopFive] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [options, setOptions] = useState([]);
    const [isSelection, setSelection] = useState(false);
    const [isAmountLink, setAmountLink] = useState(false);
    const [isCostLink, setCostLink] = useState(false);
    const [isTopFiveLink, setTopFiveLink] = useState(false);
    const [curYear, setYear] = useState(moment().year());
    useEffect(() => {
        (async () => {
            try {
                let months = [];
                const res = await services.waste.get();

                const thisYear = res.data.result.filter(a => moment(a.dateScanned).year() === moment().year());

                const sortedData = thisYear.sort((a, b) => {
                    return new Date(a.dateScanned) - new Date(b.dateScanned)
                });
                const month = sortedData.map(sd => ({ ...sd, month: moment(sd.dateScanned).format('MMM') }));
                const sumCostPerMonth = month.reduce((acc, cur) => {
                    const costToInt = parseInt(cur.cost);
                    acc[cur.month] = acc[cur.month] + costToInt || costToInt;
                    return acc
                }, {});
                const keys = Object.keys(sumCostPerMonth);
                keys.forEach(key => {
                    months.push({
                        label: key.toUpperCase(),
                        value: key.toLowerCase()
                    });
                });
                setOptions(months);


            } catch (err) {
                console.log(err)
            }
        })();
    }, [])

    const handleSelection = (selection, month) => {
        switch (selection) {
            case 'amount':
                handleGetMonthlyDataByAmount(month);
                break;
            case 'cost':
                handleGetMonthlyDataByCost(month);
                break;
            case 'topFive':
                handleGetTopFive(month);
                break;
            default:
                setIsCost(false);
                setIsAmount(false);
                setIsTopFive(false);
        }
    };
    const bySelection = (obj, selection) => {
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
            if (selection === 'amount') {
                return {
                    week: `wk${key}`,
                    amount: obj[key],
                }
            } else if (selection === 'cost') {
                return {
                    week: `wk${key}`,
                    cost: obj[key],
                }
            }
        });
        const newArr = wk.map(w => {
            if (selection === 'amount') {
                return {
                    week: `wk${w}`,
                    amount: 0
                }
            }
            else if (selection === 'cost') {
                return {
                    week: `wk${w}`,
                    cost: 0
                }
            }
        });
        const combined = [...oldArr, ...newArr];
        combined.map(c => {
            if (c.week === 'wk5' && c.amount === 0 || c.week === 'wk5' && c.cost === 0) {
                const index = combined.indexOf(c);
                if (index > -1) {
                    combined.splice(index, 1);
                }
            }
        })
        return combined.sort((a, b) => a.week.localeCompare(b.week))
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

    const handleGetMonthlyDataByAmount = async (month) => {
        setSpinner(true);
        setIsAmount(true);
        setIsCost(false);
        setIsTopFive(false);
        setAmountLink(true);
        setCostLink(false);
        setTopFiveLink(false);
        try {
            const res = await services.waste.get();
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
            const amt = bySelection(total, 'amount');
            setMonthlyWasteDataByAmount(amt);
            setSpinner(false);
        } catch (err) {
            console.log(err);
        }
    }

    const handleGetMonthlyDataByCost = async (month) => {
        setSpinner(true);
        setIsCost(true);
        setIsAmount(false);
        setIsTopFive(false);
        setAmountLink(false);
        setCostLink(true);
        setTopFiveLink(false);
        try {
            const res = await services.waste.get();
            if (res.data.result) {
                const week = res.data.result.map(data => ({ ...data, week: Math.floor((moment(data.dateScanned).date() - 1) / 7) + 1 }));
                let dataForMonth = [];
                let total;
                week.map(data => {
                    if (moment(data.dateScanned).format("MMM").toUpperCase() === month.toUpperCase()) {
                        dataForMonth.push(data);
                        const totalPerWeek = dataForMonth.reduce((acc, cur) => {
                            const costToInt = parseInt(cur.cost);
                            acc[cur.week] = acc[cur.week] + costToInt || costToInt;
                            return acc;
                        }, {});
                        total = totalPerWeek;
                    }
                });
                const cost = bySelection(total, 'cost');
                setMonthlyWasteDataByCost(cost);
                setSpinner(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleGetTopFive = async (month) => {
        setSpinner(true);
        setIsCost(false);
        setIsAmount(false);
        setIsTopFive(true);
        setAmountLink(false);
        setCostLink(false);
        setTopFiveLink(true);
        try {
            const res = await services.waste.get();
            const week = res.data.result.map(data => ({ ...data, week: Math.floor((moment(data.dateScanned).date() - 1) / 7) + 1 }));
            let dataForMonth = [];
            let total;
            week.map(data => {
                if (moment(data.dateScanned).format("MMM").toUpperCase() === month.toUpperCase()) {
                    dataForMonth.push(data);
                    const totalPerWeek = dataForMonth.reduce((acc, cur) => {
                        acc[cur.product] = acc[cur.product] + cur.amount || cur.amount;
                        return acc;
                    }, {});
                    total = totalPerWeek;
                }
            });
            setMonthlyTopFive(byProduct(total, 'topFive'));
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
        <View style={{ ...styles.container }} onStartShouldSetResponder={() => {
            if (open) {
                setOpen(false)
            }
        }
        }>
            <Text style={styles.headerLabel}>Monthly Data, by Amount & Cost</Text>
            <DropDownPicker
                open={open}
                value={value}
                items={options}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setOptions}
                onChangeValue={() => {
                    if (value !== null) {
                        setSelection(true);
                    } else {
                        setSelection(false);
                    }
                }}
                onOpen={onChildDropdownOpen}
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
            <View style={{ zIndex: 1 }}>
                {
                    isSelection &&
                    <View style={styles.selection}>
                        <View>
                            {
                                isAmountLink &&
                                <View style={styles.textBar}></View>
                            }
                            <TouchableOpacity
                                onPress={() => handleSelection('amount', value)}
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
                                onPress={() => handleSelection('cost', value)}
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
                                onPress={() => handleSelection('topFive', value)}
                            >
                                <Text>Most Wasted</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                {
                    isAmount &&
                    <View>
                        <VictoryChart width={400} theme={VictoryTheme.material}>

                            <VictoryLabel text="By Amount 🗑" x={225} y={30} textAnchor="end" />
                            <VictoryBar
                                data={monthlyWasteDataByAmount} x="week" y="amount" labels={({ datum }) => `${datum.amount}`} style={{
                                    data: {
                                        fill: "#004d40",
                                        stroke: ({ datum }) => datum.amount <= 20 ? "green" : "red",
                                        fillOpacity: 0.7,
                                        strokeWidth: 1
                                    },
                                    labels: {
                                        fontSize: 15,
                                        fill: ({ datum }) => datum.amount <= 20 ? "green" : "red"
                                    },
                                }} />
                        </VictoryChart>
                        <VictoryLegend x={70} y={1}
                            centerTitle
                            orientation="horizontal"
                            gutter={20}
                            data={[
                                { name: "Amount <=20", symbol: { fill: "green" } },
                                { name: "Amount >20", symbol: { fill: "red" } },
                            ]}
                        />
                    </View>
                }
                {
                    isCost &&
                    <View>
                        <VictoryChart width={400} theme={VictoryTheme.material}>
                            <VictoryLabel text="By Cost 💷" x={225} y={30} textAnchor="end" />
                            <VictoryBar data={monthlyWasteDataByCost} x="week" y="cost" labels={({ datum }) => `£${datum.cost}`} style={{
                                data: {
                                    fill: "#004d40",
                                    stroke: ({ datum }) => datum.cost <= 50 ? "green" : "red",
                                    fillOpacity: 0.7,
                                    strokeWidth: 1
                                },
                                labels: {
                                    fontSize: 15,
                                    fill: ({ datum }) => datum.cost <= 50 ? "green" : "red"
                                },
                            }} />
                        </VictoryChart>
                        <VictoryLegend x={70} y={1}
                            centerTitle
                            orientation="horizontal"
                            gutter={20}
                            data={[
                                { name: "Cost <=50", symbol: { fill: "green" } },
                                { name: "Amount >50", symbol: { fill: "red" } },
                            ]}
                        />
                    </View>
                }
                {
                    isTopFive &&
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <VictoryPie
                            colorScale={["black", "#19e9b6", "#004d40", "#323232", "#616161"]}
                            data={monthlyTopFive}
                            x={`product`}
                            y="amount"
                            style={{ labels: { fontSize: 10, fontWeight: "bold" } }}
                            animate
                            width={350}
                            labelPosition="centroid"
                            labelPlacement="perpendicular"
                        />
                        <VictoryLegend x={70} y={1}
                            centerTitle
                            orientation="horizontal"
                            gutter={20}
                            data={handleLegend(monthlyTopFive, ["black", "#19e9b6", "#004d40", "#323232", "#616161"])}
                        />
                    </View>
                }
            </View>
        </View>
    )
}

export default MonthlyReports;

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
        marginTop: 20

    },
    headerSelection: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 80,

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
        margin: 20,
        zIndex: 10
    },
    textBar: {
        width: 40,
        backgroundColor: '#004d40',
        height: 2,
        borderRadius: 5,
        alignSelf: 'center'
    }
})
