let groups = 4*6;
let startDate = new Date(1553679636 - 48 * 3600000).setHours(20, 0, 0, 0);
let dateRandom = [];
let size = groups/2;
// console.log(startDate);
		for (let index = 0; index < groups; index++) {
			dateRandom[index] = new Date(startDate).getHours() === 18 ? startDate += 7200000 : startDate += (46 * 3600000);
      // console.log('dateRandom', new Date(dateRandom[index]));
    }

		// xáo trộn date
		let temp = [];
		// for (let index = 0; index < size; index ++) {
    //   // if (index) {
    //     temp = new Date(dateRandom[index]);
    //     dateRandom[index] = new Date(dateRandom[index + 6*i]);
    //     dateRandom[index + size] = temp;
    //   // }
    // }
    let temp1;
    for (let index = 0; index < 4; index++) {
      temp1 = index;
      for (let j = 0; j < 6; j++) {
          // temp[index * 6 + j] = new Date(dateRandom[index * 6 + j + 4]);
          console.log(index * 6 + j);
          
          temp.push(temp1 + 1, new Date(dateRandom[temp1]));
          // console.log('temp1', temp1);
          temp1 += 4;
          
          // dateRandom[index] = new Date(dateRandom[index + 4]);
          // dateRandom[index + 4] = temp;
        }
    }
		// console.log(temp);
