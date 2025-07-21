import React,{ useMemo,useRef } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useState,useEffect } from "react";
import { axiosOther } from "../../../../../http/axios_base_url";
import { itineraryMonumentInitialValue } from "../qoutation_initial_value";

import {
  notifyError,
  notifyHotError,
  notifyHotSuccess,
  notifySuccess,
} from "../../../../../helper/notify";
import {
  setLocalMonumentFormValue,
  setQoutationResponseData,
  storeMonumentDayType,
} from "../../../../../store/actions/queryAction";
import monumentIcon from "../../../../../images/itinerary/monument.svg";
import {
  setMonumentPrice,
  setTogglePriceState,
  setTotalMonumentPricePax,
} from "../../../../../store/actions/PriceAction";
import {
  setItineraryMonumentData,
  setLocalItineraryMonumentData,
} from "../../../../../store/actions/itineraryDataAction";
import { FaChevronCircleUp,FaChevronCircleDown } from "react-icons/fa";
import { Modal,Button,Row,Col,Table } from "react-bootstrap";
import { MdEdit } from "react-icons/md";
import PerfectScrollbar from "react-perfect-scrollbar";
import { monumentAutoGuideToggle } from "../../../../../store/actions/ItineraryServiceAction";
import HotelIcon from "../../../../../images/itinerary/hotel.svg";
import { Toaster,toast } from "react-hot-toast";
import { preinit } from "react-dom";
import { quotationData } from "../../qoutation-first/quotationdata";
import {
  setItineraryCopyMonumentFormData,
  setItineraryCopyMonumentFormDataCheckbox,
} from "../../../../../store/actions/itineraryServiceCopyAction/itineraryServiceCopyAction";
import moment from "moment";
import IsDataLoading from "../IsDataLoading";

const Monument = ({ Type,checkBoxes,headerDropdown }) => {
  const { qoutationData,queryData,isItineraryEditing,localMonumentValue } =
    useSelector((data) => data?.queryReducer);
  const { AutoGuideCheck } = useSelector(
    (data) => data?.ItineraryServiceReducer
  );

  const monumentDataLoad = useSelector(
    (state) => state.inineraryServiceDataLoadReducer.monument
  );

  const [monumentDataLoadCount,setMonumentDataLoadCount] = useState(true);
  const dispatch = useDispatch();
  const tokenData = JSON.parse(localStorage.getItem("token"));
  const prevServiceIds = useRef([]);
  const [monumentFromValue,setMonumentFormValue] = useState([]);
  const [isCopyHotel,setIsCopyHotel] = useState(false);
  const [originalFromValue,setOriginalFormValue] = useState([]);
  const [monumentPackageList,setMonumentPackageList] = useState([]);
  const [isInitializing,setIsInitializing] = useState(true);
  const [monumentPackageLists,setMonumentPackageLists] = useState([]);
  const [multipleMonument,setMultipleMonument] = useState([]);
  const [destinationList,setDestinationList] = useState([]);
  const { monumentFormData,localMonumentFormData } = useSelector(
    (data) => data?.itineraryReducer
  );
  const [dayType,setDayType] = useState([]);
  const [rateList,setRateList] = useState([]);
  const [isOpen,setIsOpen] = useState(false);
  const [modalCentered,setModalCentered] = useState(false);
  const [changeMonument,setChangeMonument] = useState({
    index: "",
    monument: [],
  });
  const [isEditingMonument,setIsEditingMonument] = useState({
    index: "",
    editing: false,
  });
  const [tempMonument,setTempMonument] = useState({
    id: "",
    name: "",
  });
  const [monumentMasterList,setMonumentMasterList] = useState([]);
  const [hikePercent,setHikePercent] = useState("");
  const [paxFormValue,setPaxFormValue] = useState({
    Adults: "",
    Child: "",
    Infant: "",
  });
  const [paxModal,setPaxModal] = useState({
    modalIndex: "",
    isShow: false,
  });
  const [supplierList,setSupplierList] = useState([]);
  const [monumentRateCalculate,setMonumentRateCalculate] = useState({
    Price: {
      Adult: "",
      FAdult: "",
      Child: "",
      FChild: "",
    },
    Markup: {
      Adult: "",
      FAdult: "",
      Child: "",
      FChild: "",
    },
    MarkupOfCost: {
      Adult: "",
      FAdult: "",
      Child: "",
      FChild: "",
    },
  });
  const [checkMonumentPrice,setCheckMonumentPrice] = useState("Foreign");
  const [isIncludeMonument,setIsIncludeMonument] = useState("No");
  const [fromToDestinationList,setFromToDestinationList] = useState([]);
  const [isPackageLoaded,setIsPackageLoaded] = useState(false);
  const [isSupplierLoaded,setIsSupplierLoaded] = useState(false);
  const [isFormValue,setIsFormValue] = useState(false);
  const [activeIndex,setActiveIndex] = useState(null);
  const [isDataLoading,setIsDataLoading] = useState(true);
  // Add ref to track if hike is being applied
  const isApplyingHike = useRef(false);
  // Store base values without hike applied
  const baseValues = useRef([]);
  
  // state of markupvalue
  const [markupArray,setMarkupArray] = useState({
    Markup: { Data: [] },
  });
  
  const MonumentData = markupArray?.Markup?.Data?.find(
    (item) => item.Type === "Monument"
  );

  const formValueInitialization = () => {
    if (qoutationData?.Days) {
      const hasMonumentService = qoutationData?.Days.some((day) =>
        day.DayServices.some((service) => service.ServiceType === "Monument")
      );

      if (hasMonumentService) {
        const initialFormValue = qoutationData?.Days?.map((day) => {
          const service = day?.DayServices?.filter(
            (service) => service?.ServiceType == "Monument"
          )[0];

          const details =
            service?.ServiceDetails && service?.ServiceDetails.flat(1)[0];

          if (service?.DestinationId) {
            service.DestinationId = parseInt(service.DestinationId);
            service.ServiceId = parseInt(service.ServiceId);
          }

          return {
            id: queryData?.QueryId,
            Leasure: service?.Leasure,
            QuatationNo: qoutationData?.QuotationNumber,
            DayType: Type,
            DayNo: day.Day,
            DayUniqueId: day?.DayUniqueId,
            Destination: day?.DestinationId,
            Date: day?.Date,
            DestinationUniqueId: day?.DestinationUniqueId,
            ServiceIdMonument: [],
            Escort: 1,
            FromDay: "",
            ToDay: "",
            ServiceId: service != undefined ? service?.ServiceId : "",
            ItemFromDate: details?.TimingDetails?.ItemFromDate,
            ItemFromTime: "",
            ItemToDate: details?.TimingDetails?.ItemToDate,
            SupplierId: details?.ItemSupplierDetail
              ? details?.ItemSupplierDetail?.ItemSupplierId
              : "",
            MonumentDayType: service?.MonumentDayType,
            ItemToTime: "",
            ServiceMainType: "No",
            RateUniqueId: "",
            ItemUnitCost: {
              Adult: details?.ItemUnitCost?.AdultCost || " ",
              Child: details?.ItemUnitCost?.ChildCost || " ",
              FAdult: details?.ItemUnitCost?.FAdultCost || " ",
              FChild: details?.ItemUnitCost?.FChildCost || "",
            },
            MonumentTime: service?.MonumentTime,
            PaxInfo: {
              Adults: qoutationData?.Pax?.AdultCount,
              Child: qoutationData?.Pax?.ChildCount,
              Infant: qoutationData?.Pax?.Infant,
              Escort: "",
            },
            ForiegnerPaxInfo: {
              Adults: "",
              Child: "",
              Infant: "",
              Escort: "",
            },
          };
        });

        const multipleMonument = qoutationData?.Days?.map((day) => {
          const service = day?.DayServices?.filter(
            (service) => service?.ServiceType == "Monument"
          )[0];
          const monument =
            service != undefined
              ? service?.ServicePackageMonument?.map((item) => {
                return {
                  id: item?.MonumentId,
                  name: item?.MonumentName,
                };
              })
              : [];

          return monument;
        });

        setMultipleMonument(multipleMonument);
        setMonumentFormValue(initialFormValue);
        setOriginalFormValue(initialFormValue);
        // Store base values for hike calculations
        baseValues.current = JSON.parse(JSON.stringify(initialFormValue));

        dispatch(setLocalMonumentFormValue(initialFormValue));
      } else {
        const monumentInitialValue = qoutationData?.Days?.map((day,ind) => {
          return {
            ...itineraryMonumentInitialValue,
            id: queryData?.QueryId,
            DayNo: day.Day,
            Date: day?.Date,
            Destination: day.DestinationId || "",
            DestinationUniqueId: day?.DestinationUniqueId,
            QuatationNo: qoutationData?.QuotationNumber,
            ItemFromDate: qoutationData?.TourSummary?.FromDate,
            ItemToDate: qoutationData?.TourSummary?.ToDate,
            DayUniqueId: day?.DayUniqueId,
            ServiceIdMonument: [],
            PaxInfo: {
              Adults: qoutationData?.Pax?.AdultCount,
              Child: qoutationData?.Pax?.ChildCount,
              Infant: qoutationData?.Pax?.Infant,
              Escort: "",
            },
          };
        });
        setMonumentFormValue(monumentInitialValue);
        setOriginalFormValue(monumentInitialValue);
        // Store base values for hike calculations
        baseValues.current = JSON.parse(JSON.stringify(monumentInitialValue));
        dispatch(setLocalMonumentFormValue(monumentInitialValue));
      }
    }
  };

  useEffect(() => {
    if (!isApplyingHike.current) {
      formValueInitialization();
      setIsInitializing(false);
    }
  },[qoutationData]);

  // FIXED: handleHikeChange function
  const handleHikeChange = (e) => {
    const { value } = e.target;
    const hikePercentValue = parseFloat(value) || 0;
    setHikePercent(value);
    isApplyingHike.current = true; // Set flag to prevent other useEffects from interfering
    
    console.log(value, hikePercentValue, "hikeparcent");
    
    // Use baseValues.current to calculate hike on original values
    const updatedData = baseValues.current?.map((item) => {
      const originalFAdult = parseFloat(item?.ItemUnitCost?.FAdult) || 0;
      const originalAdult = parseFloat(item?.ItemUnitCost?.Adult) || 0;
      const originalChild = parseFloat(item?.ItemUnitCost?.Child) || 0;
      const originalFChild = parseFloat(item?.ItemUnitCost?.FChild) || 0;

      return {
        ...monumentFromValue.find(current => current.DayNo === item.DayNo) || item,
        Hike: hikePercentValue,
        ItemUnitCost: {
          ...item.ItemUnitCost,
          FAdult: Math.floor(originalFAdult + (originalFAdult * hikePercentValue) / 100),
          Adult: Math.floor(originalAdult + (originalAdult * hikePercentValue) / 100),
          Child: Math.floor(originalChild + (originalChild * hikePercentValue) / 100),
          FChild: Math.floor(originalFChild + (originalFChild * hikePercentValue) / 100),
        },
      };
    });

    setMonumentFormValue(updatedData);
    
    // Reset flag after a short delay
    setTimeout(() => {
      isApplyingHike.current = false;
    }, 100);
  };

  // Update base values when rates are fetched or monument packages change
  const updateBaseValues = (newValues) => {
    if (!isApplyingHike.current) {
      baseValues.current = JSON.parse(JSON.stringify(newValues));
    }
  };

  const processedIndices = useRef(new Set());

  const setFirstValueIntoForm = (index) => {
    if (
      !Array.isArray(monumentPackageList) ||
      !Array.isArray(monumentPackageList[index]) ||
      monumentPackageList[index].length === 0
    ) {
      return;
    }

    const processedIndices = new Set();

    if (processedIndices.has(index)) {
      return;
    }

    const processActivityIds = (monumentPackageList) => {
      const idIndicesMap = {};
      monumentPackageList.forEach((subArray,idx) => {
        if (Array.isArray(subArray) && subArray[0]?.id !== undefined && subArray[0]?.id !== null) {
          const id = subArray[0].id;
          if (!idIndicesMap[id]) {
            idIndicesMap[id] = [];
          }
          idIndicesMap[id].push(idx);
        }
      });

      const result = Array(monumentPackageList.length).fill(null);

      for (const id in idIndicesMap) {
        const indices = idIndicesMap[id];
        if (indices.length > 1) {
          result[indices[1]] = id;
        } else {
          if (indices[0] !== 0 && indices[0] !== monumentPackageList.length - 1) {
            result[indices[0]] = id;
          }
        }
      }

      return result;
    };

    const processedIds = processActivityIds(monumentPackageList);
    const activityId = processedIds[index] ?? null;

    const program = monumentPackageList[index]?.[0];
    const supplier = supplierList[index]?.[0];
    const isFirstOrLast = index === 0 || index === monumentPackageList.length - 1;

    let sumFAdult = 0;
    let sumAdult = 0;

    if (program?.MultipleMonument && Array.isArray(program.MultipleMonument)) {
      program.MultipleMonument.forEach((monument) => {
        if (monument.RateJson && Array.isArray(monument.RateJson) && monument.RateJson.length > 0) {
          const firstRate = monument.RateJson[0];
          sumFAdult += Number(firstRate.ForeignerAdultEntFee) || 0;
          sumAdult += Number(firstRate.IndianAdultEntFee) || 0;
        }
      });
    }

    setMonumentFormValue((prevArr) => {
      const current = prevArr[index] || {};
      const newValues = {
        ...current,
        ServiceId: isFirstOrLast ? null : activityId,
        SupplierId: isFirstOrLast || current.SupplierId ? current.SupplierId : supplier?.id || current.SupplierId,
        SupplierName: supplier?.Name || current.SupplierName,
      };

      const newArr = [...prevArr];
      newArr[index] = newValues;
      
      // Update base values when not applying hike
      updateBaseValues(newArr);
      
      return newArr;
    });

    processedIndices.add(index);

    if (program?.id) {
      filterMonumentPackageList(program.id,index);
    }
  };

  useEffect(() => {
    const days = qoutationData?.Days || [];

    const allDaysEmpty =
      Array.isArray(qoutationData?.Days) &&
      qoutationData.Days.every((day) => {
        if (!Array.isArray(day.DayServices)) return true;
        const guideServices = day.DayServices.filter(
          (service) =>
            service.ServiceType === "Monument" &&
            service?.ServiceMainType === "Guest"
        );
        return guideServices.length === 0;
      });

    if (!allDaysEmpty) return;

    if (
      checkBoxes?.includes("monument") &&
      monumentFromValue.length > 0 &&
      monumentPackageList.length === monumentFromValue.length &&
      supplierList.length === monumentFromValue.length &&
      !isPackageLoaded &&
      monumentPackageList.every(arr => Array.isArray(arr)) &&
      !isApplyingHike.current // Don't interfere when applying hike
    ) {
      monumentFromValue.forEach((_,index) => {
        setFirstValueIntoForm(index);
      });
      setIsPackageLoaded(true);
    }
  },[
    checkBoxes,
    monumentFromValue?.map((row) => row.Destination).join(","),
    monumentPackageList,
    supplierList,
    qoutationData,
    isPackageLoaded,
  ]);

  const postDataToServer = async () => {
    try {
      setIsDataLoading(true);
      try {
        try {
          const { data } = await axiosOther.post("destinationlist");
          setDestinationList(data?.DataList);
        } catch (error) {
          console.log("error",error);
        }
      } catch (error) {
        console.log(error);
      }
      try {
        let CompanyUniqueId = JSON.parse(
          localStorage.getItem("token")
        )?.companyKey;
        const { data } = await axiosOther.post("listCompanySetting",{
          id: "",
          CompanyId: CompanyUniqueId,
        });
        const rawData = data?.DataList?.[0]?.Value || [];
        const transformedData = rawData.map((item) => ({
          Type: item.ProductName,
          Markup: item.MarkupType,
          Value: item.MarkupValue,
        }));

        setMarkupArray({
          Markup: {
            MarkupType: "Service Wise",
            Data: transformedData,
          },
        });
      } catch (error) {
        console.error(error);
      }
    } finally {
      setIsDataLoading(false);
    }
  };

  const getSupplierList = async (index,id) => {
    try {
      const { data } = await axiosOther.post("supplierlist",{
        Name: "",
        id: "",
        SupplierService: [5],
        DestinationId: [id],
      });
      setSupplierList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.DataList;
        return newArr;
      });
    } catch (error) {
      console.log("error",error);
    }
  };

  useEffect(() => {
    if (!monumentDataLoad) return
    monumentFromValue?.forEach((item,index) => {
      if (item?.Destination != "") {
        getSupplierList(index,item?.Destination);
      }
    });
  },[monumentFromValue?.map((item) => item?.Destination)?.join(","),monumentDataLoad]);

  const getMonumentPackageListDependently = async (cityId,index) => {
    try {
      const { data } = await axiosOther.post("monument-package-list",{
        Destination: cityId,
        Default: "Yes",
      });

      setMonumentPackageList((prevList) => {
        const newList = [...prevList];
        newList[index] = data?.DataList || [];
        return newList;
      });
    } catch (error) {
      console.log("error",error);
    }
  };

  useEffect(() => {
    if (!monumentDataLoad) return;
    const fetchAllPackages = async () => {
      const promises = monumentFromValue.map((row,index) =>
        row.Destination ? getMonumentPackageListDependently(row.Destination,index) : Promise.resolve()
      );
      await Promise.all(promises);
    };
    fetchAllPackages();
  },[
    monumentFromValue?.map((row) => row.Destination).join(","),
    monumentDataLoad,
  ]);

  const filterMonumentPackageList = (packageId,index) => {
    console.log(packageId,index,"checkpackage");

    const filteredMonument = monumentPackageList[index]?.filter(
      (pckg) => pckg?.id == packageId
    );

    const newDayType = filteredMonument?.[0]?.DayType || "";
    const monuments = filteredMonument?.[0]?.MultipleMonument || [];

    const normalizedMonuments = monuments.map((monument) => {
      let normalizedRateJson = [];

      if (Array.isArray(monument.RateJson)) {
        normalizedRateJson = monument.RateJson;
      } else if (monument?.RateJson?.Data?.[0]?.RateDetails) {
        normalizedRateJson = monument.RateJson.Data[0].RateDetails;
      }

      return {
        ...monument,
        RateJson: normalizedRateJson,
      };
    });

    const totalAdultFee = normalizedMonuments.reduce((sum,monument) => {
      const rate = monument?.RateJson?.[0]?.ForeignerAdultEntFee;
      const fee = parseFloat(rate);
      return sum + (isNaN(fee) ? 0 : fee);
    },0);

    const totalChildFee = normalizedMonuments.reduce((sum,monument) => {
      const rate = monument?.RateJson?.[0]?.IndianAdultEntFee;
      const fee = parseFloat(rate);
      return sum + (isNaN(fee) ? 0 : fee);
    },0);

    const initialFormValue = qoutationData?.Days?.map((day) => {
      const service = day?.DayServices?.filter(
        (service) => service?.ServiceType == "Monument"
      )[0];

      setMonumentFormValue((prevArr) => {
        const newArr = [...prevArr];
        const currentItem = prevArr[index];

        if (currentItem?.ServiceId && currentItem.ServiceId === packageId) {
          const updatedItem = {
            ...currentItem,
            MonumentDayType: newDayType || monumentFromValue[index]?.MonumentDayType || "",
            DayType: newDayType || " ",
            ItemUnitCost: {
              ...currentItem.ItemUnitCost,
              FAdult: totalAdultFee || monumentFromValue[index]?.ItemUnitCost?.FAdult || "",
              Adult: totalChildFee || monumentFromValue[index]?.ItemUnitCost?.FAdult || "",
            },
          };
          newArr[index] = updatedItem;
          
          // Update base values with new rates
          updateBaseValues(newArr);
        }

        return newArr;
      });
    })

    setDayType((prevData) => {
      const newData = [...prevData];
      if (monumentFromValue[index]?.ServiceId) {
        newData[index] = newDayType || monumentFromValue[index]?.MonumentDayType;
      }
      return newData;
    });

    setMultipleMonument((prevList) => {
      const newList = [...prevList];
      if (monumentFromValue[index]?.ServiceId === packageId) {
        const monumentsWithRates = normalizedMonuments.filter(
          (monument) => Array.isArray(monument.RateJson)
        );
        newList[index] = monumentsWithRates.length > 0
          ? monumentsWithRates
          : multipleMonument[index] || [];
      }
      return newList;
    });
  };

  useEffect(() => {
    if (!isApplyingHike.current) { // Don't interfere when applying hike
      monumentFromValue.forEach((row,index) => {
        if (row.ServiceId && row.ServiceId !== prevServiceIds.current[index]) {
          filterMonumentPackageList(row.ServiceId,index);
        }
      });
      prevServiceIds.current = monumentFromValue.map((row) => row.ServiceId);
    }
  },[monumentFromValue]);

  useEffect(() => {
    dispatch(storeMonumentDayType(dayType));
  },[dayType]);

  const removeMonument = (monumentInd,index) => {
    const filteredMonument = multipleMonument[index]?.filter(
      (value,ind) => ind != monumentInd
    );
    setMultipleMonument((prevArr) => {
      const newArr = [...prevArr];
      newArr[index] = filteredMonument;
      return newArr;
    });
  };

  const handleMonumentFormChange = (ind,e) => {
    const { name,value,checked } = e.target;

    if (name != "Leasure") {
      if (name.includes(".")) {
        const [parentKey,childKey] = name.split(".");
        setMonumentFormValue((prevArr) => {
          const newArr = [...prevArr];
          const updatedItem = {
            ...newArr[ind],
            [parentKey]: { ...newArr[ind][parentKey],[childKey]: value },
          };
          newArr[ind] = updatedItem;
          
          // Update base values when not applying hike
          updateBaseValues(newArr);
          
          return newArr;
        });
        setOriginalFormValue((prevArr) => {
          const newArr = [...prevArr];
          newArr[ind] = {
            ...newArr[ind],
            [parentKey]: { ...newArr[ind][parentKey],[childKey]: value },
          };
          return newArr;
        });
      } else {
        setMonumentFormValue((prevArr) => {
          const newArr = [...prevArr];
          const updatedItem = { ...newArr[ind],[name]: value };
          newArr[ind] = updatedItem;
          
          // Update base values when not applying hike
          updateBaseValues(newArr);
          
          return newArr;
        });
        setOriginalFormValue((prevArr) => {
          const newArr = [...prevArr];
          newArr[ind] = { ...newArr[ind],[name]: value };
          return newArr;
        });
      }
    } else {
      setMonumentFormValue((prevArr) => {
        const newArr = [...prevArr];
        const updatedItem = { ...newArr[ind],Leasure: checked ? "Yes" : "No" };
        newArr[ind] = updatedItem;
        
        // Update base values when not applying hike
        updateBaseValues(newArr);
        
        return newArr;
      });
    }
  };

  const handleHotelTableIncrement = (index) => {
    const indexHotel = monumentFromValue[index];
    setMonumentFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1,0,{ ...indexHotel,isCopied: true });
      return newArr;
    });
    setOriginalFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(index + 1,0,{ ...indexHotel,isCopied: true });
      return newArr;
    });
  };

  const handleHotelTableDecrement = (index) => {
    const filteredTable = monumentFromValue?.filter(
      (item,ind) => ind != index
    );
    setMonumentFormValue(filteredTable);
    setOriginalFormValue(filteredTable);
  };

  const handleFinalSave = async () => {
    const finalMonumentNested =
      monumentFromValue?.map((_,parentIndex) => {
        if (!multipleMonument?.[parentIndex]?.length) return [];

        return multipleMonument[parentIndex]
          .map((monument) => {
            let rate = {};
            if (Array.isArray(monument?.RateJson)) {
              rate = monument.RateJson[0] || {};
            } else if (monument?.RateJson?.Data?.[0]?.RateDetails) {
              rate = monument.RateJson.Data[0].RateDetails[0] || {};
            }

            return {
              MonumentId: monument?.id || "",
              MonumentName: monument?.name || "Unknown",
              IAdultPrice: rate?.IndianAdultEntFee || "0",
              FAdultPrice: rate?.ForeignerAdultEntFee || "0",
            };
          })
          .filter((monument) => monument.MonumentId !== "");
      }) || [];
      
    const totalAdultServiceCost = monumentFromValue?.reduce((total,item) => {
      const adultCost = parseFloat(item.ItemUnitCost?.FAdult) || 0;
      return total + adultCost;
    },0);

    const finalJson = monumentFromValue
      ?.map((row,index) => {
        return {
          ...row,
          Hike: hikePercent,
          ServiceIdMonument: finalMonumentNested[index] || [],
          DayType: Type,
          Include: isIncludeMonument,
          Sector: fromToDestinationList[index],
          TotalCosting: {
            ServiceAdultCost: monumentRateCalculate?.Price?.Adult,
            ServiceChildCost: monumentRateCalculate?.Price?.Child,
            AdultMarkupValue: MonumentData?.Value,
            ChildMarkupValue: MonumentData?.Value,
            AdultMarkupTotal: monumentRateCalculate?.Markup?.Adult,
            ChildMarkupTotal: monumentRateCalculate?.Markup?.Adult,
            TotalAdultServiceCost:
              totalAdultServiceCost +
              (totalAdultServiceCost * MonumentData?.Value) / 100,
            TotalChildServiceCost:
              monumentRateCalculate?.Price?.Child +
              monumentRateCalculate?.Markup?.Child,
          },
        };
      })
      .filter((services) => services?.MonumentDayType != "None");

    const totalMonumentAmount = monumentFromValue?.reduce((total,item) => {
      const adultCost = parseFloat(item.ItemUnitCost?.Adult) || 0;
      const childCost = parseFloat(item.ItemUnitCost?.Child) || 0;
      return total + adultCost + childCost;
    },0);

    try {
      const { data } = await axiosOther.post(
        "update-quotation-monument",
        finalJson
      );

      if (data?.status == 1) {
        notifyHotSuccess(data?.message);
        dispatch(setTotalMonumentPricePax(totalMonumentAmount));
        dispatch(setQoutationResponseData(data?.data));
      }
    } catch (error) {
      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyHotError(data[0][1]);
      }
      if (error.response?.data) {
        const data = Object.entries(error.response?.data);
        notifyHotError(data[0][1]);
      }
    }
  };

  const monumentMasterListApit = async (destination) => {
    const { data } = await axiosOther.post("monumentmasterlist",{
      MonumentName: "",
      Destination: destination,
      id: "",
      Default: "",
    });

    setMonumentMasterList(data?.DataList);
  };

  useEffect(() => {
    const costArr = monumentFromValue?.map((mon) => {
      if (mon?.ServiceId !== "") {
        let arr = [mon?.ItemUnitCost?.Adult,mon?.ItemUnitCost?.Child];

        arr = arr.map((value,index) => {
          if (
            value === null ||
            value === undefined ||
            value === "" ||
            isNaN(value)
          ) {
            arr[index] = 0;
          }
          if (typeof value === "string" && !isNaN(value)) {
            arr[index] = parseFloat(value);
          }
          return arr[index];
        });

        const rate = arr.reduce((acc,curr) => acc + curr,0);
        return rate;
      } else {
        return 0;
      }
    });
  },[
    monumentFromValue
      ?.map((mon) => mon?.ItemUnitCost?.Adult + mon?.ItemUnitCost?.Child)
      ?.join(","),
    monumentFromValue?.map((item) => item?.ServiceId).join(","),
  ]);

  useEffect(() => {
    if (!monumentDataLoad) return;
    postDataToServer();
    monumentMasterListApit();
  },[monumentDataLoad]);

  const mergeMonumentRate = (index) => {
    const rate = rateList[index];
    const form = monumentFromValue[index];

    if (rate && rate.length > 0) {
      const item = rate[0]?.RateJson;
      setMonumentFormValue((prevMon) => {
        const newMon = [...prevMon];
        const updatedItem = {
          ...newMon[index],
          ItemUnitCost: {
            Adult: item?.AdultEntFee || 0,
            Child: item?.ChildEntFee || 0,
            FAdult: item?.AdultEntFee || 0,
            FChild: item?.ChildEntFee || 0,
          },
        };
        newMon[index] = updatedItem;
        
        // Update base values with new rates
        updateBaseValues(newMon);
        
        return newMon;
      });
    } else {
      setMonumentFormValue((prevMon) => {
        const newMon = [...prevMon];
        const updatedItem = {
          ...newMon[index],
          ItemUnitCost: {
            Adult: 0,
            Child: 0,
            FAdult: 0,
            FChild: 0,
          },
        };
        newMon[index] = updatedItem;
        
        // Update base values
        updateBaseValues(newMon);
        
        return newMon;
      });
    }
  };

  useEffect(() => {
    if (!isApplyingHike.current) { // Don't interfere when applying hike
      monumentFromValue?.forEach((form,index) => {
        if (form?.ServiceId && rateList[index]) {
          mergeMonumentRate(index);
        }
      });
    }
  },[
    rateList,
    monumentFromValue?.map((monument) => monument?.ServiceId).join(","),
  ]);

  useEffect(() => {
    if (Type == "Main") {
      dispatch(setItineraryMonumentData(monumentFromValue));
    } else {
      dispatch(setLocalItineraryMonumentData(monumentFromValue));
    }
  },[monumentFromValue]);

  useEffect(() => {
    if (Type == "Main") {
      dispatch(setLocalMonumentFormValue(monumentFromValue));
    } else {
      setMonumentFormValue(localMonumentValue);
    }
  },[monumentFromValue]);

  const getMonumentRateApi = async (destination,index,date,srvcId) => {
    const monumentUID =
      monumentPackageList[index] != undefined
        ? monumentPackageList[index]?.find((pckg) => pckg?.id == srvcId)
        : "";

    try {
      const { data } = await axiosOther.post("monumentsearchlist",{
        id: "",
        MonumentUID: monumentUID?.UniqueID,
        Destination: destination,
        CompanyId: tokenData?.CompanyUniqueId,
        Date: "",
        ValidFrom: qoutationData?.TourSummary?.FromDate,
        ValidTo: qoutationData?.TourSummary?.FromDate,
        QueryId: queryData?.QueryId,
        QuatationNo: qoutationData?.QuotationNumber,
        Year: headerDropdown?.Year,
      });

      setRateList((prevArr) => {
        const newArr = [...prevArr];
        newArr[index] = data?.Data;
        return newArr;
      });
    } catch (error) {
      console.log("error",error);
    }
  };

  useEffect(() => {
    if (!monumentDataLoad) return;
    monumentFromValue?.forEach((form,index) => {
      getMonumentRateApi(
        form?.DestinationUniqueId,
        index,
        form?.Date,
        form?.ServiceId
      );
    });
  },[
    monumentFromValue?.map((form) => form?.Destination)?.join(","),
    monumentFromValue?.map((form) => form?.ServiceId)?.join(","),
    monumentDataLoad,
  ]);

  useEffect(() => {
    if (!checkBoxes?.includes("monument")) {
      formValueInitialization();
    }
  },[checkBoxes]);

  const addTempMonument = () => {
    if (!isEditingMonument?.editing && tempMonument?.id != "") {
      const checkIsExist = changeMonument.monument?.some(
        (mon) => mon?.id == tempMonument?.id
      );
      if (!checkIsExist) {
        setChangeMonument({
          ...changeMonument,
          monument: [
            ...changeMonument.monument,
            { id: tempMonument?.id,name: tempMonument?.name },
          ],
        });
        setTempMonument({ id: "",name: "" });
        setIsEditingMonument({ index: "",editing: false });
      }
    }
  };

  const checkDeleteMonument = (item,index) => {
    const filteredMonument = changeMonument.monument.filter(
      (item,ind) => ind != index
    );
    setChangeMonument({ ...changeMonument,monument: filteredMonument });
  };

  const monumentFinalSave = () => {
    if (
      Array.isArray(changeMonument.monument) &&
      typeof changeMonument.index === "number"
    ) {
      const newMonArr = [...multipleMonument];

      newMonArr[changeMonument.index] = changeMonument.monument.map((mon) => ({
        id: mon.id,
        name: mon.name,
        RateJson: mon.RateJson || [],
      }));

      setMultipleMonument(newMonArr);
      setIsFormValue(true);
    }

    setTempMonument({ id: "",name: "" });
    setModalCentered(false);
  };

  const handleTempMonumentChange = (e) => {
    const { value } = e.target;
    const filteredMonument = monumentMasterList?.find(
      (mon) => mon?.id == value
    );

    setTempMonument({
      id: filteredMonument?.id,
      name: filteredMonument?.MonumentName,
    });
  };

  const handlePaxChange = (index,e) => {
    const { name,value } = e.target;
    setPaxFormValue({ ...paxFormValue,[name]: value });
  };

  const handlePaxModalClick = (index) => {
    setPaxModal({ modalIndex: index,isShow: true });

    const form = monumentFromValue?.filter((form,ind) => ind == index)[0];
    setPaxFormValue({
      Adults: form?.PaxInfo?.Adults,
      Child: form?.PaxInfo?.Child,
      Infant: form?.PaxInfo?.Infant,
    });
  };

  const handlePaxSave = () => {
    setMonumentFormValue((prevForm) => {
      const newForm = [...prevForm];
      newForm[paxModal?.modalIndex] = {
        ...newForm[paxModal?.modalIndex],
        PaxInfo: paxFormValue,
      };
      return newForm;
    });
    setOriginalFormValue((prevForm) => {
      const newForm = [...prevForm];
      newForm[paxModal?.modalIndex] = {
        ...newForm[paxModal?.modalIndex],
        PaxInfo: paxFormValue,
      };
      return newForm;
    });

    setPaxModal({ modalIndex: "",isShow: false });
  };

  useEffect(() => {
    const calculateTotalCosts = (data) => {
      let totalAdultCost = 0;
      let totalFAdultCost = 0;
      let totalChildCost = 0;
      let totalFChildCost = 0;

      data.forEach((item) => {
        const adult = parseFloat(item.ItemUnitCost.Adult) || 0;
        const Fadult = parseFloat(item.ItemUnitCost.FAdult) || 0;
        const child = parseFloat(item.ItemUnitCost.Child) || 0;
        const Fchild = parseFloat(item.ItemUnitCost.FChild) || 0;

        totalAdultCost += adult;
        totalFAdultCost += Fadult;
        totalChildCost += child;
        totalFChildCost += Fchild;
      });

      return {
        totalAdultCost,
        totalFAdultCost,
        totalChildCost,
        totalFChildCost,
      };
    };

    const filteredMonumentValue = monumentFromValue?.filter(
      (form) => form?.ServiceId != ""
    );

    const { totalAdultCost,totalFAdultCost,totalChildCost,totalFChildCost } =
      calculateTotalCosts(filteredMonumentValue);

    const markupValue = parseFloat(MonumentData?.Value) || 0;

    let totalPriceForPax =
      totalAdultCost +
      totalFAdultCost +
      totalChildCost +
      totalFChildCost +
      ((totalAdultCost + totalFAdultCost + totalChildCost + totalFChildCost) *
        markupValue) /
      100;

    dispatch(setMonumentPrice(totalPriceForPax));
    dispatch(setTogglePriceState());

    setMonumentRateCalculate((prevData) => ({
      ...prevData,
      Price: {
        Adult: totalAdultCost,
        FAdult: totalFAdultCost,
        Child: totalChildCost,
        FChild: totalFChildCost,
      },
      MarkupOfCost: {
        Adult: parseInt(totalAdultCost * MonumentData?.Value) / 100 || 0,
        FAdult: parseInt(totalFAdultCost * MonumentData?.Value) / 100 || 0,
        Child: parseInt(totalChildCost * MonumentData?.Value) / 100 || 0,
        FChild: parseInt(totalFChildCost * MonumentData?.Value) / 100 || 0,
      },
    }));
  },[
    monumentFromValue?.map((item) => item?.ItemUnitCost?.Adult).join(","),
    monumentFromValue?.map((item) => item?.ItemUnitCost?.FAdult).join(","),
    monumentFromValue?.map((item) => item?.ItemUnitCost?.FChild).join(","),
    monumentFromValue?.map((item) => item?.ItemUnitCost?.Child).join(","),
    monumentFromValue?.map((item) => item?.ServiceId).join(","),
    hikePercent,
    MonumentData?.Value,
  ]);

  useEffect(() => {
    const destinations = monumentFromValue?.map((hotel,index,hotelArr) => {
      return {
        From: hotel?.Destination,
        To: hotelArr[index + 1]?.Destination,
      };
    });

    const currAndPrevDest = destinations?.map((dest,ind) => {
      const currentAndPrev =
        dest?.From == destinations[ind - 1]?.From
          ? { From: dest?.From,To: "" }
          : { From: dest?.From,To: destinations[ind - 1]?.From };
      return currentAndPrev;
    });

    const FromToDestination = currAndPrevDest?.map((item) => {
      const filteredFromDest = destinationList.find(
        (dests) => dests?.id == item?.From
      );
      const filteredToDest = destinationList.find(
        (dests) => dests?.id == item?.To
      );

      if (filteredToDest != undefined) {
        return `${filteredToDest?.Name} To ${filteredFromDest?.Name}`;
      } else {
        return filteredFromDest?.Name;
      }
    });

    setFromToDestinationList(FromToDestination);
  },[
    monumentFromValue?.map((hotel) => hotel?.Destination).join(","),
    destinationList,
  ]);

  useEffect(() => {
    if (Type !== "Main" && isCopyHotel) {
      setMonumentFormValue(monumentFormData);
    }
  },[]);

  const handleHotelCopy = (e) => {
    const { checked } = e.target;
    if (checked) {
      setIsCopyHotel(true);
      setMonumentFormValue(monumentFromValue);
    } else {
      setIsCopyHotel(false);
      setMonumentFormValue(localMonumentValue);
    }
  };

  const getTotalIndianFee = (index) => {
    if (!Array.isArray(multipleMonument[index])) {
      return 0;
    }

    return multipleMonument[index].reduce((total,curr) => {
      const fullMonument =
        changeMonument.monument?.find((m) => m.id === curr.id) ||
        monumentMasterList.find((m) => m.id === curr.id) ||
        curr;

      const rateJson = fullMonument?.RateJson;

      let fee = 0;

      if (Array.isArray(rateJson) && rateJson.length > 0) {
        fee = rateJson[0]?.IndianAdultEntFee;
      } else if (rateJson && typeof rateJson === "object") {
        fee = rateJson?.IndianAdultEntFee;
      }

      const numericFee = parseFloat(fee) || 0;
      const hikeAmount = numericFee * (parseFloat(hikePercent) / 100);

      return total + numericFee + hikeAmount;
    },0);
  };

  const getTotalforFee = (index) => {
    if (!Array.isArray(multipleMonument[index])) return 0;

    return multipleMonument[index].reduce((total,curr) => {
      const fullMonument =
        changeMonument.monument?.find((m) => m.id === curr.id) ||
        monumentMasterList.find((m) => m.id === curr.id) ||
        curr;

      const rateJson = fullMonument?.RateJson;

      let fee = 0;

      if (Array.isArray(rateJson) && rateJson.length > 0) {
        fee = rateJson[0]?.ForeignerAdultEntFee;
      } else if (rateJson && typeof rateJson === "object") {
        fee = rateJson?.ForeignerAdultEntFee;
      }

      const numericFee = parseFloat(fee) || 0;
      const hikeAmount = numericFee * (parseFloat(hikePercent) / 100);

      return total + numericFee + hikeAmount;
    },0);
  };

  useEffect(() => {
    if (isFormValue && activeIndex !== null) {
      const copiedData = JSON.parse(JSON.stringify(monumentFromValue));

      copiedData[activeIndex].ItemUnitCost.FAdult = getTotalforFee(activeIndex);
      copiedData[activeIndex].ItemUnitCost.Adult =
        getTotalIndianFee(activeIndex);

      setMonumentFormValue(copiedData);
      
      // Update base values
      updateBaseValues(copiedData);
      
      setIsFormValue(false);
    }
  },[isFormValue,activeIndex]);

  const handleIsOpen = () => {
    if (monumentDataLoadCount) {
      dispatch({
        type: "SET_MONUMENT_DATA_LOAD",
        payload: true,
      });
      setMonumentDataLoadCount(false);
    }

    setIsOpen(!isOpen);
  };

  useEffect(() => {
    return () => {
      dispatch({
        type: "SET_MONUMENT_DATA_LOAD",
        payload: false,
      });
    };
  },[]);

  const monumentCheckbox = useSelector(
    (state) => state.itineraryServiceCopyReducer.monumentCheckbox
  );

  useEffect(() => {
    if (monumentCheckbox) {
      dispatch(
        setItineraryCopyMonumentFormData({
          MonumentForm: monumentFromValue,
          MultipleMonument: multipleMonument,
        })
      );
    }
  },[monumentFromValue,multipleMonument]);

  useEffect(() => {
    return () => {
      dispatch(setItineraryCopyMonumentFormDataCheckbox(true));
    };
  },[]);

  const handleIndianFeeChange = (e,monumentId) => {
    const newValue = parseFloat(e.target.value) || "";

    setChangeMonument((prev) => {
      const updatedMonuments = (prev.monument || []).map((m) => {
        if (m.id === monumentId) {
          const updatedRateJson = JSON.parse(JSON.stringify(m.RateJson || {}));

          updatedRateJson.Data = updatedRateJson.Data || [{}];
          updatedRateJson.Data[0] = updatedRateJson.Data[0] || {};
          updatedRateJson.Data[0].RateDetails = updatedRateJson.Data[0]
            .RateDetails || [{}];
          updatedRateJson.Data[0].RateDetails[0] =
            updatedRateJson.Data[0].RateDetails[0] || {};

          updatedRateJson.Data[0].RateDetails[0] = {
            ...updatedRateJson.Data[0].RateDetails[0],
            IndianAdultEntFee: newValue.toString(),
          };

          return {
            ...m,
            RateJson: updatedRateJson,
          };
        }
        return m;
      });

      return {
        ...prev,
        monument: updatedMonuments,
      };
    });
  };
  
  const handleForeignFeeChange = (e,monumentId) => {
    const newValue = parseFloat(e.target.value) || "";

    setChangeMonument((prev) => {
      const updatedMonuments = (prev.monument || []).map((m) => {
        if (m.id === monumentId) {
          const updatedRateJson = JSON.parse(JSON.stringify(m.RateJson || {}));

          updatedRateJson.Data = updatedRateJson.Data || [{}];
          updatedRateJson.Data[0] = updatedRateJson.Data[0] || {};
          updatedRateJson.Data[0].RateDetails = updatedRateJson.Data[0]
            .RateDetails || [{}];
          updatedRateJson.Data[0].RateDetails[0] =
            updatedRateJson.Data[0].RateDetails[0] || {};

          updatedRateJson.Data[0].RateDetails[0] = {
            ...updatedRateJson.Data[0].RateDetails[0],
            ForeignerAdultEntFee: newValue.toString(),
          };

          return {
            ...m,
            RateJson: updatedRateJson,
          };
        }
        return m;
      });

      return {
        ...prev,
        monument: updatedMonuments,
      };
    });
  };

  return (
    <div className="row mt-3 m-0">
      <Toaster position="top-center" />
      <div
        className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg"
        onClick={handleIsOpen}
      >
        <div className="d-flex gap-4 align-items-center">
          <div className="d-flex gap-2">
            <img src={monumentIcon} alt="monumentIcon" />
            <label htmlFor="" className="fs-5">
              Monument
            </label>
          </div>
          <div
            className="form-check check-sm d-flex align-items-center justify-content-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              className="form-check-input height-em-1 width-em-1"
              name="MonumentCost"
              value={"Yes"}
              id="auto_guide"
              checked={AutoGuideCheck}
              onChange={(e) => dispatch(monumentAutoGuideToggle())}
            />
            <label
              htmlFor="auto_guide"
              className="mt-1"
              style={{ fontSize: "0.8rem" }}
            >
              Auto Guide
            </label>
          </div>
        </div>

        <div
          className="d-flex gap-3 align-items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {Type == "Main" && (
            <div
              className="d-flex gap-2 align-items-center hike-input"
              onClick={(e) => e.stopPropagation()}
            >
              <label htmlFor="" className="fs-6">
                Hike
              </label>
              <input
                type="number"
                className={`formControl3`}
                value={hikePercent}
                onChange={handleHikeChange}
              />
              <span className="fs-6">%</span>
            </div>
          )}
          <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
            <input
              type="radio"
              className="form-check-input height-em-1 width-em-1"
              name="MonumentCost"
              value={"Foreign"}
              id="foreigner_cost"
              checked={checkMonumentPrice?.includes("Foreign")}
            />
            <label
              htmlFor="foreigner_cost"
              className="mt-1"
              style={{ fontSize: "0.8rem" }}
            >
              Foreigner
            </label>
          </div>
          <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
            <input
              type="radio"
              className="form-check-input height-em-1 width-em-1"
              name="MonumentCost"
              value={"Indian"}
              id="indian_cost"
              checked={checkMonumentPrice?.includes("Indian")}
              onChange={(e) => setCheckMonumentPrice(e.target.value)}
            />
            <label
              htmlFor="indian_cost"
              className="mt-1"
              style={{ fontSize: "0.8rem" }}
            >
              Indian
            </label>
          </div>
          <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
            <input
              type="radio"
              className="form-check-input height-em-1 width-em-1"
              name="MonumentCost"
              value={"Both"}
              id="both_cost"
              checked={checkMonumentPrice?.includes("Both")}
              onChange={(e) => setCheckMonumentPrice(e.target.value)}
            />
            <label
              htmlFor="both_cost"
              className="mt-1"
              defaultChecked
              style={{ fontSize: "0.8rem" }}
            >
              Both
            </label>
          </div>
          <span className="cursor-pointer fs-5">
            {!isOpen ? (
              <FaChevronCircleUp
                className="text-primary"
                onClick={(e) => {
                  e.stopPropagation(),setIsOpen(!isOpen);
                }}
              />
            ) : (
              <FaChevronCircleDown
                className="text-primary"
                onClick={(e) => {
                  e.stopPropagation(),setIsOpen(!isOpen);
                }}
              />
            )}
          </span>
        </div>
      </div>
      <Modal
        className="fade bd-example-modal-sm"
        size="sm"
        show={paxModal?.isShow}
      >
        <Modal.Header>
          <Modal.Title>Add Pax</Modal.Title>
          <Button
            variant=""
            className="btn-close"
            onClick={() => setPaxModal({ modalIndex: "",isShow: false })}
          ></Button>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="col-4">
              <label htmlFor="shortName">Adult</label>
              <input
                type="text"
                className={`form-control form-control-sm`}
                name="Adults"
                placeholder="Pax"
                value={paxFormValue?.Adults}
                onChange={(e) => handlePaxChange(paxModal.modalIndex,e)}
              />
            </Col>
            <Col className="col-4">
              <label htmlFor="shortName">Child</label>
              <input
                type="text"
                className={`form-control form-control-sm`}
                name="Child"
                placeholder="Pax"
                value={paxFormValue?.Child}
                onChange={(e) => handlePaxChange(paxModal.modalIndex,e)}
              />
            </Col>
            <Col className="col-4">
              <label htmlFor="shortName">Infant</label>
              <input
                type="text"
                className={`form-control form-control-sm`}
                name="Infant"
                placeholder="Pax"
                value={paxFormValue.Infant}
                onChange={(e) => handlePaxChange(paxModal.modalIndex,e)}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger light"
            onClick={() => setPaxModal({ modalIndex: "",isShow: false })}
            className="btn-custom-size"
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handlePaxSave}
            className="btn-custom-size"
          >
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
      {isOpen && (
        isDataLoading ? (
          <IsDataLoading />
        ) : (
          <>
            <div className="col-12 px-0 mt-2">
              <PerfectScrollbar>
                <table class="table table-bordered itinerary-table">
                  <thead>
                    <tr>
                      <th
                        rowSpan={3}
                        className="py-1 align-middle text-center days-width-9"
                      >
                        {monumentFromValue[0]?.Date ? "Day / Date" : "Day"}
                      </th>
                      {(Type == "Local" || Type == "Foreigner") && (
                        <th rowSpan={3} className="py-1 align-middle">
                          Escort
                        </th>
                      )}
                      <th rowSpan={3} className="py-1 align-middle">
                        Destination
                      </th>
                      <th rowSpan={3} className="py-1 align-middle">
                        Program
                      </th>
                      <th
                        rowSpan={3}
                        className="py-1 align-middle column-width-4"
                      >
                        Day Type
                      </th>
                      <th rowSpan={3} className="py-1 align-middle">
                        Time
                      </th>
                      <th
                        rowSpan={2}
                        className="py-1 align-middle column-width-4"
                      >
                        Leasure
                      </th>
                      <th rowSpan={3} className="py-1 align-middle">
                        Monuments Name
                      </th>
                      <th rowSpan={3} className="py-1 align-middle">
                        Supplier
                      </th>
                      <th colSpan={checkMonumentPrice == "Both" ? 4 : 2}>
                        <div className="form-check check-sm d-flex align-items-center justify-content-center gap-2">
                          <input
                            type="checkbox"
                            className="form-check-input height-em-1 width-em-1"
                            name="Breakfast"
                            value={"Yes"}
                            id="monument_include"
                            checked={isIncludeMonument == "Yes"}
                            onChange={(e) =>
                              setIsIncludeMonument(
                                e.target.checked == true ? "Yes" : "No"
                              )
                            }
                          />
                          <label
                            htmlFor="monument_include"
                            className="mt-1"
                            style={{ fontSize: "0.8rem" }}
                          >
                            Include
                          </label>
                        </div>
                      </th>
                    </tr>
                    <tr>
                      {(checkMonumentPrice == "Indian" ||
                        checkMonumentPrice == "Both") && (
                          <th colSpan={2} className="py-1 align-middle">
                            Indian Cost
                          </th>
                        )}
                      {(checkMonumentPrice == "Foreign" ||
                        checkMonumentPrice == "Both") && (
                          <th colSpan={2} className="py-1 align-middle">
                            Foreigner Cost
                          </th>
                        )}
                    </tr>
                    <tr>
                      <th>
                        <div className="form-check check-sm d-flex align-items-center justify-content-center w-100">
                          <input
                            type="checkbox"
                            className="form-check-input height-em-1 width-em-1"
                            name="Leasure"
                            value={"Yes"}
                            checked={monumentFromValue?.every(
                              (form) => form?.Leasure == "Yes"
                            )}
                            onChange={(e) => {
                              setMonumentFormValue((prevArr) => {
                                const newArr = [...prevArr];
                                return newArr.map((form) => {
                                  return {
                                    ...form,
                                    Leasure: e.target.checked ? "Yes" : "No",
                                  };
                                });
                              });
                            }}
                          />
                        </div>
                      </th>
                      {(checkMonumentPrice == "Indian" ||
                        checkMonumentPrice == "Both") && (
                          <>
                            <th className="py-1 align-middle">Adult</th>
                            <th className="py-1 align-middle">Child</th>
                          </>
                        )}
                      {(checkMonumentPrice == "Foreign" ||
                        checkMonumentPrice == "Both") && (
                          <>
                            <th className="py-1 align-middle">Adult</th>
                            <th className="py-1 align-middle">Child</th>
                          </>
                        )}
                    </tr>
                  </thead>
                  <tbody>
                    {monumentFromValue?.map((item,index) => {
                      return (
                        <tr key={index + 1}>
                          <td>
                            <div className="d-flex gap-1 justify-content-start align-items-center">
                              <div className="d-flex gap-1 align-items-center">
                                <div
                                  className="d-flex align-items-center pax-icon"
                                  onClick={() => handlePaxModalClick(index)}
                                >
                                  <i className="fa-solid fa-person"></i>
                                </div>
                                <span
                                  onClick={() => handleHotelTableIncrement(index)}
                                >
                                  <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                </span>

                                <span
                                  onClick={() => handleHotelTableDecrement(index)}
                                >
                                  <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                </span>
                              </div>
                              {item?.Date ? (
                                <span
                                  style={{
                                    textWrap: "nowrap",
                                    marginRight: "5px",
                                  }}
                                >
                                  <div className="d-flex gap-2">
                                    <div>{`Day ${item?.DayNo}`}</div>
                                    <div>{`${moment(item?.Date).format(
                                      "DD-MM-YYYY"
                                    )}`}</div>
                                  </div>
                                </span>
                              ) : (
                                <span>{`Day ${item?.DayNo}`}</span>
                              )}
                            </div>
                          </td>
                          {(Type == "Local" || Type == "Foreigner") && (
                            <td style={{ width: "30px" }}>
                              <div>
                                <input
                                  name="Escort"
                                  type="number"
                                  style={{ width: "30px" }}
                                  className={`formControl1`}
                                  value={monumentFromValue[index]?.Escort}
                                  onChange={(e) =>
                                    handleMonumentFormChange(index,e)
                                  }
                                />
                              </div>
                            </td>
                          )}
                          <td>
                            <div>
                              <select
                                name="Destination"
                                id=""
                                className="formControl1"
                                value={monumentFromValue[index]?.Destination}
                                onChange={(e) =>
                                  handleMonumentFormChange(index,e)
                                }
                              >
                                <option value="">Select</option>
                                {qoutationData?.Days?.map((qout,index) => {
                                  return (
                                    <option
                                      value={qout?.DestinationId}
                                      key={index + 1}
                                    >
                                      {qout?.DestinationName}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="ServiceId"
                                id=""
                                className="formControl1"
                                onChange={(e) => {
                                  handleMonumentFormChange(index,e);
                                  filterMonumentPackageList(
                                    e.target.value,
                                    index
                                  );
                                }}
                                value={monumentFromValue[index]?.ServiceId}
                              >
                                <option value="0">Select</option>
                                {monumentPackageList[index]?.map(
                                  (pckg,pkgIndex) => (
                                    <option value={pckg?.id} key={pkgIndex + "k"}>
                                      {pckg?.PackageName}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </td>
                          <td className="column-width-4">
                            <div className="column-width-4">
                              <span>
                                {monumentFromValue[index]?.MonumentDayType}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="MonumentTime"
                                id=""
                                className="formControl1"
                                value={monumentFromValue[index]?.MonumentTime}
                                onChange={(e) =>
                                  handleMonumentFormChange(index,e)
                                }
                              >
                                <option value="None">None</option>
                                <option value="EarlyMorning">
                                  Early Morning
                                </option>
                                <option value="Morning">Morning</option>
                                <option value="Afternoon">Afternoon</option>
                                <option value="Evening">Evening</option>
                              </select>
                            </div>
                          </td>
                          <td className="column-width-4">
                            <div className="form-check check-sm d-flex align-items-center justify-content-center w-100">
                              <input
                                type="checkbox"
                                className="form-check-input height-em-1 width-em-1"
                                name="Leasure"
                                value={"Yes"}
                                checked={
                                  monumentFromValue[index]?.Leasure == "Yes"
                                }
                                onChange={(e) =>
                                  handleMonumentFormChange(index,e)
                                }
                              />
                            </div>
                          </td>
                          <td className="position-relative">
                            <div className="d-flex justify-content-center gap-3 flex-wrap pe-3">
                              {multipleMonument[index]?.map(
                                (item,monumentIndex) => {
                                  return (
                                    <div
                                      className="p-1 border d-inline-block"
                                      key={monumentIndex + 1}
                                    >
                                      <span>{item?.name}</span>
                                      <span
                                        className=""
                                        onClick={() =>
                                          removeMonument(monumentIndex,index)
                                        }
                                      >
                                        <i className="fa-solid fa-circle-xmark ms-2 cursor-pointer text-primary"></i>
                                      </span>
                                    </div>
                                  );
                                }
                              )}
                              {monumentFromValue[index]?.ServiceId != "" && (
                                <div
                                  className="d-flex align-items-center position-absolute"
                                  style={{ right: "0.4rem",top: "0.5rem" }}
                                >
                                  <MdEdit
                                    className="fs-5 text-primary cursor-pointer"
                                    onClick={() => {
                                      setModalCentered(true),
                                        setChangeMonument({
                                          index: index,
                                          monument: multipleMonument[index],
                                        }),
                                        monumentMasterListApit(item?.Destination);
                                      setActiveIndex(index);
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div>
                              <select
                                name="SupplierId"
                                id=""
                                className="formControl1"
                                value={monumentFromValue[index]?.SupplierId}
                                onChange={(e) =>
                                  handleMonumentFormChange(index,e)
                                }
                              >
                                <option value="">Select</option>
                                {supplierList[index]?.map((supp,index) => {
                                  return (
                                    <option value={supp?.id} key={index}>
                                      {supp?.Name}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </td>
                          {(checkMonumentPrice == "Indian" ||
                            checkMonumentPrice == "Both") && (
                              <>
                                <td>
                                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <input
                                      type="number"
                                      className="formControl1"
                                      name="ItemUnitCost.Adult"
                                      value={
                                        monumentFromValue[index]?.ItemUnitCost
                                          ?.Adult
                                      }
                                      onChange={(e) =>
                                        handleMonumentFormChange(index,e)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <input
                                      type="number"
                                      className="formControl1"
                                      name="ItemUnitCost.Child"
                                      value={
                                        monumentFromValue[index]?.ItemUnitCost
                                          ?.Child
                                      }
                                      onChange={(e) =>
                                        handleMonumentFormChange(index,e)
                                      }
                                    />
                                  </div>
                                </td>
                              </>
                            )}
                          {(checkMonumentPrice == "Foreign" ||
                            checkMonumentPrice == "Both") && (
                              <>
                                <td>
                                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <input
                                      type="number"
                                      className="formControl1"
                                      name="ItemUnitCost.FAdult"
                                      value={
                                        monumentFromValue[index].ItemUnitCost.FAdult
                                      }
                                      onChange={(e) =>
                                        handleMonumentFormChange(index,e)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <input
                                      type="number"
                                      className="formControl1"
                                      name="ItemUnitCost.FChild"
                                      value={
                                        monumentFromValue[index]?.ItemUnitCost
                                          ?.FChild
                                      }
                                      onChange={(e) =>
                                        handleMonumentFormChange(index,e)
                                      }
                                    />
                                  </div>
                                </td>
                              </>
                            )}
                        </tr>
                      );
                    })}
                    <tr className="costing-td">
                      <td
                        colSpan={
                          Type === "Main"
                            ? checkMonumentPrice != "Both"
                              ? 6
                              : 6
                            : checkMonumentPrice == "Both"
                              ? 7
                              : 7
                        }
                        rowSpan={3}
                        className="text-center fs-6"
                      >
                        Total
                      </td>
                      <td colSpan={2}>Monument Cost</td>
                      {(checkMonumentPrice == "Both" ||
                        checkMonumentPrice == "Indian") && (
                          <>
                            <td>{monumentRateCalculate?.Price?.Adult}</td>
                            <td>{monumentRateCalculate?.Price?.Child}</td>
                          </>
                        )}
                      {(checkMonumentPrice == "Both" ||
                        checkMonumentPrice == "Foreign") && (
                          <>
                            <td>{monumentRateCalculate?.Price?.FAdult}</td>
                            <td>{monumentRateCalculate?.Price?.FChild}</td>
                          </>
                        )}
                    </tr>
                    <tr className="costing-td">
                      <td colSpan={2}>
                        Markup({MonumentData?.Value}) {MonumentData?.Markup}
                      </td>
                      {(checkMonumentPrice == "Both" ||
                        checkMonumentPrice == "Indian") && (
                          <>
                            <td>{monumentRateCalculate?.MarkupOfCost?.Adult}</td>
                            <td>{monumentRateCalculate?.MarkupOfCost?.Child}</td>
                          </>
                        )}
                      {(checkMonumentPrice == "Both" ||
                        checkMonumentPrice == "Foreign") && (
                          <>
                            <td>{monumentRateCalculate?.MarkupOfCost?.FAdult}</td>
                            <td>{monumentRateCalculate?.MarkupOfCost?.FChild}</td>
                          </>
                        )}
                    </tr>
                    <tr className="costing-td">
                      <td colSpan={2}>Total</td>
                      {(checkMonumentPrice == "Both" ||
                        checkMonumentPrice == "Indian") && (
                          <>
                            <td>
                              {(
                                parseFloat(
                                  monumentRateCalculate?.Price?.Adult || 0
                                ) +
                                parseFloat(
                                  monumentRateCalculate?.MarkupOfCost?.Adult || 0
                                )
                              ).toFixed(2)}
                            </td>
                            <td>
                              {(
                                parseFloat(
                                  monumentRateCalculate?.Price?.Child || 0
                                ) +
                                parseFloat(
                                  monumentRateCalculate?.MarkupOfCost?.Child || 0
                                )
                              ).toFixed(2)}
                            </td>
                          </>
                        )}
                      {(checkMonumentPrice == "Both" ||
                        checkMonumentPrice == "Foreign") && (
                          <>
                            <td>
                              {(
                                parseFloat(
                                  monumentRateCalculate?.Price?.FAdult || 0
                                ) +
                                parseFloat(
                                  monumentRateCalculate?.MarkupOfCost?.FAdult || 0
                                )
                              ).toFixed(2)}
                            </td>
                            <td>
                              {(
                                parseFloat(
                                  monumentRateCalculate?.Price?.FChild || 0
                                ) +
                                parseFloat(
                                  monumentRateCalculate?.MarkupOfCost?.FChild || 0
                                )
                              ).toFixed(2)}
                            </td>
                          </>
                        )}
                    </tr>
                  </tbody>
                </table>
              </PerfectScrollbar>
            </div>
            <Modal className="fade quotationList" show={modalCentered}>
              <Modal.Header>
                <Modal.Title>Monument</Modal.Title>
                <Button
                  onClick={() => setModalCentered(false)}
                  variant=""
                  className="btn-close"
                ></Button>
              </Modal.Header>
              <Modal.Body className="py-2">
                <Row className="form-row-gap-2">
                  <Col className="col-12 mt-2">
                    <div style={{ maxHeight: "400px",overflowY: "auto" }}>
                      {Array.isArray(changeMonument?.monument) && (
                        <Table
                          responsive
                          striped
                          bordered
                          className="rate-table mt-2"
                        >
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Monument</th>
                              <th>Adult (I)</th>
                              <th>Adult (F)</th>
                            </tr>
                          </thead>

                          <tbody>
                            {monumentMasterList?.map((monument) => {
                              const selected = changeMonument?.monument?.find(
                                (m) => m.id == monument.id
                              );

                              const isChecked = !!selected;

                              const selectedRateJson =
                                selected?.RateJson?.Data?.[0]?.RateDetails?.[0];
                              const masterRateJson =
                                monument?.RateJson?.Data?.[0]?.RateDetails?.[0];

                              const indianFee =
                                selectedRateJson?.IndianAdultEntFee !== undefined
                                  ? selectedRateJson.IndianAdultEntFee
                                  : masterRateJson?.IndianAdultEntFee ?? "";
                              const foreignFee =
                                selected?.RateJson?.Data?.[0]?.RateDetails?.[0]
                                  ?.ForeignerAdultEntFee ??
                                monument?.RateJson?.Data?.[0]?.RateDetails?.[0]
                                  ?.ForeignerAdultEntFee ??
                                "";

                              const handleCheckboxChange = () => {
                                if (isChecked) {
                                  setChangeMonument((prev) => ({
                                    ...prev,
                                    monument: prev.monument.filter(
                                      (m) => m.id !== monument.id
                                    ),
                                  }));
                                } else {
                                  const selectedMonument =
                                    monumentMasterList.find(
                                      (m) => m.id === monument.id
                                    );
                                  if (!selectedMonument) return;

                                  const deepCopiedRateJson = JSON.parse(
                                    JSON.stringify(selectedMonument.RateJson)
                                  );

                                  setChangeMonument((prev) => ({
                                    ...prev,
                                    monument: [
                                      ...prev.monument,
                                      {
                                        id: selectedMonument.id,
                                        name: selectedMonument.MonumentName,
                                        RateJson:
                                          deepCopiedRateJson?.Data?.[0]
                                            ?.RateDetails?.[0] || [],
                                      },
                                    ],
                                  }));
                                }
                              };

                              return (
                                <tr key={monument.id}>
                                  <td>
                                    <div className="d-flex gap-2 flex-wrap px-1">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={handleCheckboxChange}
                                        className="form-check-input"
                                      />
                                    </div>
                                  </td>
                                  <td>{monument.MonumentName || "N/A"}</td>
                                  <td>
                                    <input
                                      type="number"
                                      value={indianFee}
                                      onChange={(e) =>
                                        handleIndianFeeChange(e,monument.id)
                                      }
                                      style={{ width: "80px" }}
                                      min="0"
                                      step="1"
                                      className="form-control form-control-sm"
                                      disabled={!isChecked}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      value={foreignFee}
                                      onChange={(e) =>
                                        handleForeignFeeChange(e,monument.id)
                                      }
                                      style={{ width: "80px" }}
                                      min="0"
                                      step="1"
                                      className="form-control form-control-sm"
                                      disabled={!isChecked}
                                    />
                                  </td>
                                </tr>
                              );
                            })}

                            <tr>
                              <td className="text-center" colSpan="2">
                                Total
                              </td>
                              <td>
                                {changeMonument?.monument.reduce(
                                  (total,curr) => {
                                    const fee =
                                      curr?.RateJson?.[0]?.IndianAdultEntFee ||
                                      curr?.RateJson?.IndianAdultEntFee;
                                    return total + (parseFloat(fee) || 0);
                                  },
                                  0
                                )}
                              </td>
                              <td>
                                {changeMonument?.monument.reduce(
                                  (total,curr) => {
                                    const fee =
                                      curr?.RateJson?.[0]?.ForeignerAdultEntFee ||
                                      curr?.RateJson?.ForeignerAdultEntFee;
                                    return total + (parseFloat(fee) || 0);
                                  },
                                  0
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      )}
                    </div>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onClick={() => setModalCentered(false)}
                  variant="danger light"
                  className="btn-custom-size"
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={monumentFinalSave}
                  className="btn-custom-size"
                >
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
            <div className="col-12 d-flex justify-content-end align-items-end">
              <button
                className="btn btn-primary py-1 px-2 radius-4"
                onClick={handleFinalSave}
              >
                <i className="fa-solid fa-floppy-disk fs-4"></i>
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default React.memo(Monument);