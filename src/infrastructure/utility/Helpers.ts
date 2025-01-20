class Helpers {
    public static findRepeaterCountInArray = (elements: any[]): any[] => {
        let repeaters: number[] = [];
      
        for (let i = 0; i < elements.length; i++) {
            let repeaterCount=0;
          for (let j = i + 1; j < elements.length; j++) {
            if (elements[i] === elements[j])  {
                repeaterCount++;
                repeaters.push(repeaterCount);             
            }
          }
        }
        console.log(repeaters);      
        return repeaters;
      };
}