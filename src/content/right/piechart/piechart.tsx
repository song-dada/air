import React, { useState, useEffect, useRef } from "react";
import { khiVFunc  } from "../../khiVfunc";
import * as d3 from "d3";

// const PieChart = (props: any) => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
  
  
//   useEffect(() => {
//       if (!svgRef.current) return;
      
//     console.log(props.onOneRow);
//     let data: any[]=[];
//     for (const key in props.onOneRow) {
//     if(key.includes("Value")) { // 값인경우
//         data.push(  
//             khiVFunc( key, props.onOneRow[key] )
//         // name: '',
//         // unit: '',
//         // value: 0,
//         // original: values
//         );
//     }
//     }
//     console.log(data);
//     // 1️⃣ 데이터 설정
//     // const data = [10, 20, 30, 40, 50];

//     // 2️⃣ SVG 크기 설정
//     const width = 300;
//     const height = 300;
//     const radius = Math.min(width, height) / 2;

//     // 3️⃣ SVG 생성
//     const svg = d3
//       .select(svgRef.current)
//       .attr("width", width)
//       .attr("height", height)
//       .append("g")
//       .attr("transform", `translate(${width / 2}, ${height / 2})`);

//     // 4️⃣ 파이 레이아웃 생성
//     const pie = d3.pie<number>().value((d) => d);
//     const dataReady = pie(data);

//     // 5️⃣ 아크(Arc) 생성
//     const arc = d3.arc<d3.PieArcDatum<number>>()
//       .innerRadius(0)  // 도넛 차트로 만들려면 innerRadius를 조정
//       .outerRadius(radius);

//     // 6️⃣ 색상 설정
//     const color = d3.scaleOrdinal(d3.schemeCategory10);

//     // 7️⃣ 데이터 바인딩 및 path 그리기
//     svg
//       .selectAll("path")
//       .data(dataReady)
//       .enter()
//       .append("path")
//       .attr("d", arc)
//       .attr("fill", (d, i) => color(i.toString()) as string)
//       .style("stroke", "#fff");

//   }, []);

//   return <svg ref={svgRef}></svg>;
// };

// export default PieChart;
// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
import { PieArcDatum } from "d3-shape";
interface DataItem {
    name: string;
    unit: string;
    value: number;
    original: number;
  }
const PieChart = (props: any) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    console.log(props.onOneRow);
    const [localState, setLocalState] = useState(props.onOneRow);

// useEffect(() => {
// }, [props.someValue]); // props가 변경될 때 localState 업데이트

    
    useEffect(() => {
        setLocalState(props.onOneRow);
        
        if (!svgRef.current) return;
        
        let data: any[]=[];
        for (const key in props.onOneRow) {
        if(key.includes("Value")) { // 값인경우
            data.push(  
                khiVFunc( key, props.onOneRow[key] )
            // name: '',
            // unit: '',
            // value: 0,
            // original: values
                );
            }
        }
        data = data.filter(d => d !== null && d !== undefined);

        
        console.log(data);
        // console.log(filteredData);
        if (data.length > 0) {
            console.log("data0이상")
          }
          




        // Specify the chart’s dimensions.
        const width = 928; // 너비
        const height = Math.min(width, 500); // 높이

        // Create the color scale.
        const color = d3.scaleOrdinal() // d3기본제공 색상 사용
            .domain(data.map(d => d.name))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

        // Create the pie layout and arc generator.
        // const pie = d3.pie()
        //     .sort(null)
        //     .value(d => {
        //         console.log("d의 구조 확인:", d);
        //         return 1234
        //         // d.value as number
        //     });

        //     const arcs = pie(data);
        //     console.log("arcs:", arcs);
        const pie = d3.pie<DataItem>()
            .sort(null)
            .value(d => {
                console.log("d:", d.value); // 개별 데이터 확인
                return d.value;
            });

            // const arcs = pie(data);
            // console.log("arcs:", arcs);
            // // ndefined면 0으로 대체


            
        const arc = d3.arc<PieArcDatum<DataItem>>()
            .innerRadius(0) // 도넛차트로 쓸거면 사용하면 됨(내부 원)
            .outerRadius(Math.min(width, height) / 2 - 1);

        // const labelRadius = arc.outerRadius()() * 0.8; // 이거 오류나니 반지름은 직접계산할 것
            const labelRadius = Math.min(width, height) / 2 - 1
        // A separate arc generator for labels.
        const arcLabel = d3.arc<PieArcDatum<DataItem>>()
            // .innerRadius(labelRadius)
            .innerRadius(0)
            .outerRadius(labelRadius);

        const arcs = pie(data);

        // Create the SVG container.
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

        // Add a sector path for each value.
        svg.append("g")
            .attr("stroke", "white")
            .selectAll()
            .data(arcs)
            .join("path")
            // .attr("fill", (d: PieArcDatum<DataItem>) => color(d.data.name))
            .attr("fill", (d: PieArcDatum<DataItem>) => color(d.data.name ?? "defaultColor") as string)

            // .attr("fill", (d: <DataItem>) => { return color(d.data.name); } )
            // .attr("d", arc)
            .append("title")
                .text(d => `${d.data.name as string}: ${d.data.value as number}`);

        // Create a new arc generator to place a label close to the edge.
        // The label shows the value if there is enough room.
        svg.append("g")
            .attr("text-anchor", "middle")
            .selectAll()
            .data(arcs)
            .join("text")
            // .attr("transform", d => `translate(${arcLabel.centroid(d as unknown as DefaultArcObject)})`)

            .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
            .call(text => text.append("tspan")
                .attr("y", "-0.4em")
                .attr("font-weight", "bold")
                .text(d => d.data.name as string))
            .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                .attr("x", 0)
                .attr("y", "0.7em")
                .attr("fill-opacity", 0.7)
                .text(d => d.data.value as number));
  
  
    }, [props.onOneRow]);
  
    return <svg ref={svgRef}></svg>;
  };
// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

export default PieChart;