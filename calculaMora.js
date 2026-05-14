function CalculosMora(){
    const colchon = 20000
    let tarjeta
    if(e.dataItem.Producto=='TARJETA'){
        tarjeta = true
        setFieldValue('7a5c89e8-a431-4b76-b3bc-24f6a187978c','Si')

        //Habilitar campos tarjeta de credito
        disableField('aef7fd98-0a00-4ec8-95d9-37840df1fe67',false) 
    }else{
        tarjeta = false
        setFieldValue('7a5c89e8-a431-4b76-b3bc-24f6a187978c','No')
 
        setFieldValue('aef7fd98-0a00-4ec8-95d9-37840df1fe67',0)
        setFieldValue('de744073-f3bd-4c05-ac6f-9ca493664262',0)
        setFieldValue('a01eeadb-b99e-4e08-9d93-3fe44b9e1cf8',0)
        setFieldValue('0456eeb3-8809-48a5-8726-87e416efdcb3',0)
    

        //Deshabilitar campos tarjeta de credito
        disableField('aef7fd98-0a00-4ec8-95d9-37840df1fe67',true)
        disableField('de744073-f3bd-4c05-ac6f-9ca493664262',true)
        disableField('a01eeadb-b99e-4e08-9d93-3fe44b9e1cf8',true)
        disableField('0456eeb3-8809-48a5-8726-87e416efdcb3',true)
    }

    setFieldValue('af9911f8-4a06-4483-b25d-6bec9e1647fe',e.dataItem.PagoMinObl);    
    setFieldValue('9b3ac68c-68ff-4928-864d-906e9d851621',e.dataItem.InteresCteObl);
    setFieldValue('c13b3910-1960-422f-835d-7ea89982f8b6',e.dataItem.InteresMoraObl);   
    setFieldValue('aef7fd98-0a00-4ec8-95d9-37840df1fe67',e.dataItem.InteresesExtracontablesObl);
    
    sessionStorage.InteresesExtracontablesObl = e.dataItem.InteresesExtracontablesObl || 0;

    execQuery(`SELECT PorcentajePagomora,PorcPagoMoraIntCte,PorcPagoMoraIntExtraC FROM SimiladorDNC_Lappiz_TasasVigentes WHERE RangoDias3 = '${e.dataItem.EdadMoraCl}'`)
    .then((response) => {      
        
            let porcentajePagomora = response[0][0].PorcentajePagomora;
            let InteresCteObl = e.dataItem.InteresCteObl
            let maxDescCTE = 0
            let porcDescIntCteIcs = 0          
            let maxDescIntM = 0
            let maxDescIntTC = 0
            let porcDescIntMoraIcs = 0  
            let porcDescIntExtraCTC = 0  

            if (e.dataItem.MecanismoAplicaCampana && e.dataItem.MecanismoAplicaCampana.includes("PAGOMORA")){
                sessionStorage.campanamora = 'si'
                maxDescCTE = parseInt(e.dataItem.InteresCteObl) * (parseInt(e.dataItem.DtoInteresesCampana)/100)  
                porcDescIntCteIcs = parseInt(e.dataItem.DtoInteresesCampana) 
                
                maxDescIntM = parseInt(e.dataItem.InteresMoraObl) * (parseInt(e.dataItem.DtoInteresesMoraCampana)/100)
                porcDescIntMoraIcs  = parseInt(e.dataItem.DtoInteresesMoraCampana)
               
                maxDescIntTC = parseInt(e.dataItem.InteresesExtracontablesObl) * (parseInt(e.dataItem.DtoInteresExtracontablesCampana)/100)
                porcDescIntExtraCTC = parseInt(e.dataItem.DtoInteresExtracontablesCampana)
            }else{
                porcDescIntCteIcs = response[0][0].PorcPagoMoraIntCte
                maxDescCTE = (porcDescIntCteIcs/100) * parseInt(InteresCteObl)
                maxDescIntM = (porcentajePagomora/100) * parseInt(e.dataItem.InteresMoraObl)
                porcDescIntMoraIcs = porcentajePagomora
                porcDescIntExtraCTC  = response[0][0].PorcPagoMoraIntExtraC 
                maxDescIntTC = parseInt(e.dataItem.InteresesExtracontablesObl) * (parseInt(porcDescIntExtraCTC)/100)
            }
        sessionStorage.PorcPagoMoraIntCte1 = porcDescIntCteIcs
         sessionStorage.PorcentajePagomora1 = porcDescIntMoraIcs
        sessionStorage.porcDescIntExtraCTC1 = porcDescIntExtraCTC
            if(!tarjeta){
                maxDescIntTC = 0
            }
            
            //Seteo de calculos CTE
            setFieldValue('36329717-6123-40c7-b4c9-d5f447a3cac4',maxDescCTE) //Max Descuento Int Cte
            setFieldValue('e076d650-c5d6-48b1-920b-295d431604b0',porcDescIntCteIcs) //%Descuento Int Cte Ics 

            let descCTE = (parseInt(e.dataItem.PagoMinObl) + colchon) - maxDescIntM - maxDescIntTC
            setFieldValue('49ed37fa-10f7-46d1-b2d3-bd4e28bef0db',descCTE)

            //Seteo calculos mora
            setFieldValue('24a29872-6b5f-40fd-bae7-cb072e972ff5',maxDescIntM)
            setFieldValue('db8c0e77-0029-4bf9-ba9a-ebc141721c33',maxDescIntM)
            setFieldValue('64fcdf9f-c6b3-4742-b4b2-e259759290d9',porcDescIntMoraIcs)//%Descuento Int Mora Ics

            if(tarjeta){
                setFieldValue('aef7fd98-0a00-4ec8-95d9-37840df1fe67',e.dataItem.InteresesExtracontablesObl)
                setFieldValue('de744073-f3bd-4c05-ac6f-9ca493664262',maxDescIntTC)//Max Desc. ExtraC TC
                setFieldValue('a01eeadb-b99e-4e08-9d93-3fe44b9e1cf8',maxDescIntTC)
                setFieldValue('0456eeb3-8809-48a5-8726-87e416efdcb3',porcDescIntExtraCTC)
            } 
                  
            let MaxTotalDesc = maxDescCTE+maxDescIntM+maxDescIntTC
            setFieldValue('6cfd4b2c-6ef4-4821-95d5-364657fda787',MaxTotalDesc)
            let abonoMin =  parseInt(e.dataItem.PagoMinObl)-MaxTotalDesc+colchon
            setFieldValue('8f7266d7-dfc0-4ff4-afad-c50fbfa67062',abonoMin)
            setFieldValue('6af98cad-1f96-4ad5-b33c-b0ddc8f68133',e.dataItem.PagoMinObl)            
    });
        
        sessionStorage.Obl = e.dataItem.Obligacion
    }