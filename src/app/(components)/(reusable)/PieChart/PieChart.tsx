"use client";

import { ComputedDatum, ResponsivePie } from "@nivo/pie";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

type PieData = {
    id: string;
    label?: string;
    value: number;
    color?: string;
};

type CenteredMetricPropType = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataWithArc: any;
    centerX: number;
    centerY: number;
};

const CenteredMetric = ({
    dataWithArc,
    centerX,
    centerY,
}: CenteredMetricPropType) => {
    let total = 0;
    dataWithArc.forEach((datum: ComputedDatum<PieData>) => {
        total += datum.value;
    });

    return (
        <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-xs capitalize"
        >
            income: {total}
        </text>
    );
};

export const PieChart = ({
    data,
    centerText,
}: {
    data: PieData[];
    centerText?: boolean;
}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const layers: any = ["arcs", "arcLabels", "arcLinkLabels", "legends"];
    if (centerText) layers.push(CenteredMetric);
    return (
        <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            enableArcLinkLabels={false}
            // borderColor={{
            //     from: "color",
            //     modifiers: [["darker", 0.2]],
            // }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#999"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
                from: "color",
                modifiers: [["darker", 2]],
            }}
            defs={[
                {
                    id: "dots",
                    type: "patternDots",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.3)",
                    size: 4,
                    padding: 1,
                    stagger: true,
                },
                {
                    id: "lines",
                    type: "patternLines",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.3)",
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10,
                },
            ]}
            tooltip={(e) => (
                <div
                    className={`bg-white text-black text-xs rounded-sm p-2 shadow-sm`}
                    style={{ backgroundColor: e.datum.color }}
                >
                    {e.datum.label}: {e.datum.formattedValue}
                </div>
            )}
            legends={[
                {
                    anchor: "bottom",
                    direction: "row",
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: "#999",
                    itemDirection: "left-to-right",
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: "circle",
                    effects: [
                        {
                            on: "hover",
                            style: {
                                itemTextColor: "#000",
                            },
                        },
                    ],
                },
            ]}
            layers={layers}
        />
    );
};
