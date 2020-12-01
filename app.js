'use strict';
//requireは要求する
//モジュールとなるオブジェクトの呼びたしを行っている
//fs(file system)モジュールを読み込んで使える状態にする
const fs = require('fs');
//ファイルを一行ずつ読み込むためのモジュール
const readline = require('readline');
//popu-pref.csvをファイルをとして読み込める状態に準備する
const rs = fs.createReadStream('./popu-pref.csv');
//readlineオブジェクトのinputとして設定しrlオブジェクト作成
//readelineモジュールにfsを設定する
const rl = readline.createInterface({ input: rs, output: {}});
const prefectureDateMap = new Map();//key:都道府県　value:集計データのオブジェクト
//popu-pref.csvのデータを1行ずつ読み込んで、設定された関数を実行する
rl.on('line',lineString =>{
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if(year === 2010 || year === 2015){
    let value = prefectureDateMap.get(prefecture);
    if(!value){
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
   if(year === 2010){
    value.popu10 = popu;
   }
   if(year === 2015){
    value.popu15 = popu;
   }
  prefectureDateMap.set(prefecture,value);
  }
});

rl.on('close',()=>{
  for(let[key,date] of prefectureDateMap){
    date.change = date.popu15 / date.popu10;
  }
  //並べ替えを行う
  const rankingArray = Array.from(prefectureDateMap).sort((pair1,pair2)=>{
    //引き算の結果、マイナスなら降順、プラスなら昇順に入れ替え
    return pair2[1].change - pair1[1].change;
  });
  //データを整形
  const rankingString = rankingArray.map(([key,value]) => {
    return(
      key +
      ': '+
      value.popu10 +
      '=>'+
      value.popu15 +
      '変化率:' +
      value.change
    );
  });
    console.log(rankingString);
});