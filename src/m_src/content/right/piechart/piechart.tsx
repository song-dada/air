import React, { useState, useEffect, useRef } from "react";
import { khaiVFunc  } from "../../khaiVfunc";
import * as d3 from "d3";

import './piechart.scss';

import { PieArcDatum } from "d3-shape";
interface DataItem {
    name: string
    unit: string
    enn: string
    value: number
    original: number
    maxV: number
    minV: number
    arr: number[]
  }
const PieChart = (props: any) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    // console.log(props.onOneRow); // 넘겨 온 값 확인
    const [conut, setConut] = useState(0);
    
    useEffect(() => {
        if (!svgRef.current) return;
        
        let data: any[]=[];
        for (const key in props.onOneRow) {
        if(key.includes("Value")) { // 값인경우
            data.push( khaiVFunc( key, props.onOneRow[key] ) );
            }
        }
        data = data.filter(d => d !== null && d !== undefined);
        if (!data || data.length === 0) return;

        let sum = 0;
        data.forEach( i => sum+=i.value);
        console.log(sum);

        
        // Specify the chart’s dimensions.
        const width =  500; // 너비
        const height = Math.min(width, 300); // 높이

        // Create the color scale.
        const color = d3.scaleOrdinal() // d3기본제공 색상 사용
            .domain(data.map(d => d.name))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

        // Create the pie layout and arc generator.
        const pie = d3.pie<DataItem>()
            .sort(null)
            .value(d => {
                // console.log("d:", d.value); // 개별 데이터 확인
                // return d.value;
                const persent =  d.value / sum * 100;
                    return persent;
            });
            
        const arc = d3.arc<PieArcDatum<DataItem>>()
            .innerRadius(0) // 도넛차트로 쓸거면 사용하면 됨(내부 원)
            .outerRadius(width / 4); // 원 크기

        // const labelRadius = Math.min(width, height) / 2 - 1 // 반지름
        const arcLabel = d3.arc<PieArcDatum<DataItem>>()
            .innerRadius(Math.min(width, height) / 5) // 1/3보다 조금 더 크게 조정 // 이건 밖으로 밀어내는건가
            .outerRadius(Math.min(width, height) / 3); // 원 밖으로 조금 밀어내기 // 숫자가 커질수록 안으로 들어옴

        const arcs = pie(data);

        // Create the SVG container.
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 3, -height / 2, width, height]) // 중앙점 잡는것 같은데

        // Add a sector path for each value.
        svg.append("g")
            .attr("transform", d => {
                if (!d) return "translate(0,0)";
                const [x, y] = arcLabel.centroid(d);
                return `translate(${x}, ${y + 10})`; // y 좌표를 +10 해서 조금 아래로 내림
            })
            .attr("stroke", "white")
            .selectAll("path")
            .data(arcs)
            .join("path")
            .attr("fill", d => color(d.data.name ?? "defaultColor") as string)
            .attr("d", d => {
                // console.log("arc path:", arc(d)); // 여기 확인
                return arc(d);
            });


        // Create a new arc generator to place a label close to the edge.
        // The label shows the value if there is enough room.
        svg.append("g")
            .selectAll("text")
            .data(arcs)
            .join("text")
            .attr("transform", d => {
                // console.log("라벨 위치 확인:", d.data.name, arcLabel.centroid(d));
                return `translate(${arcLabel.centroid(d)})`;
            })
            .attr("text-anchor", d => {
                if (!d) return "middle"; // 만약 d가 없으면 중앙 정렬로 기본값 설정
                const [x] = arcLabel.centroid(d);
                return "middle";
                // return x > 0 ? "start" : "end"; // 오른쪽이면 start, 왼쪽이면 end
            })
            .call(text => text.append("tspan")
                .attr("x", 0)
                .attr("y", "0.7em")
                .attr("fill-opacity", 0.7)
                // .text(d => d.data.original));
                // .text(d => {
                //     // const persent =  d.data.value / sum * 100;
                //     // let reText = parseFloat(persent.toFixed(2));
                //     // return reText+'%';
                //     // return persent;
                //     // const re = 

                //     return d.data["enn"]
                // })
                .text(d => {
                    const persent =  d.data.value / sum * 100;
                    let reText = parseFloat(persent.toFixed(1));
                    if(isNaN(reText)){
                        return `측정소 오류로 인해 \n 값을 확인할수 없습니다.`
                        // return "측정소 오류로 인해<br/> 값을 확인할수 없습니다."
                    }
                    return reText+'%';
                    // return persent;
                })
            );

        // 범례
        const legendData = data.map(d => ({ name: d.name, color: color(d.name) }));
        const legend = svg.append("g")
                .attr("transform", `translate(${width / 3 }, ${height / 10 - 10})`) 
                .selectAll("g")
                .data(legendData)
                .join("g")
                .attr("transform", (d, i) => `translate(0, ${i * 20})`); // 범례 간격 설정
            // 색상 박스 추가
            legend.append("rect")
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", (d) => d.color as string);

            // 범례 텍스트 추가
            legend.append("text")
                .selectAll("tspan")
                .data(d => d.name.split(" ")) // 띄어쓰기 기준으로 줄바꿈
                .enter()
                .append("tspan")
                .attr("x", 20)
                .attr("dy", "1em") // 줄 간격 조정
                .text((d: any) => d);

        if (svgRef.current) {
            svgRef.current.innerHTML = ""; // 기존 내용 제거
            svgRef.current.appendChild(svg.node()!);
        }
            
    }, [props.onOneRow]);
  
    return (
        <>
            <div className="piechart" style={{ width: "450px", height: "300px", minHeight: "300px" }}>
                <svg ref={svgRef} width="100%" height="100%" />
            </div>
        </>
    );
  };

  export default PieChart;