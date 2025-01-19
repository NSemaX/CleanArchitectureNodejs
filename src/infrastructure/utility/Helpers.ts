class Helpers {
    public static hasDuplicateElements =  (elements: any[]): boolean => {
        let result = false;
        let duplicates: number[] = [];
      
        for (let i = 0; i < elements.length; i++) {
            let duplicateCount=0;
          for (let j = i + 1; j < elements.length; j++) {
            if (elements[i] === elements[j])  {
                duplicateCount++;
                duplicates.push(duplicateCount);             
            }
          }
        }
        let greater = 0;
        const maxProductCount = 5;
        duplicates.forEach((num) => { if (num > maxProductCount) greater++; });
        if(greater >0)
            result=true;
        return result;
      };
}