function CreateModelInf()
{
   var   i,j;
   i = 0;
   gModelInfo[i] = SetModelInf('2009');
   j = 0;
   gModelInfo[i].CodeList[j++] = SetModelCode('CU1');
   gModelInfo[i].CodeList[j++] = SetModelCode('CU2');
   gModelInfo[i].CodeList[j++] = SetModelCode('CU3');
   gModelInfo[i].CodeList[j++] = SetModelCode('CW1');
   gModelInfo[i].CodeList[j++] = SetModelCode('CW2');
   gModelInfo[i].CodeList[j++] = SetModelCode('CW3');
   i++;
   gModelInfo[i] = SetModelInf('2010');
   j = 0;
   gModelInfo[i].CodeList[j++] = SetModelCode('CU1');
   gModelInfo[i].CodeList[j++] = SetModelCode('CU2');
   gModelInfo[i].CodeList[j++] = SetModelCode('CU3');
   gModelInfo[i].CodeList[j++] = SetModelCode('CW1');
   gModelInfo[i].CodeList[j++] = SetModelCode('CW2');
   gModelInfo[i].CodeList[j++] = SetModelCode('CW3');
   i++;
}
function SetModelInf(strYear)
{
   var  data = new Array;
   data.Year = strYear;
   data.CodeList = new Array;
   return data;
}
function SetModelCode(strCode)
{
   var  data = new Array;
   data.Code = strCode;
   return data;
}
function SetManualType()
{
   gSmFlag = 1;
   gBrmFlag = 1;
}
