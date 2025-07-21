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
  // state of markupvalue
  const [markupArray,setMarkupArray] = useState({
    Markup: { Data: [] },
  });

  const MonumentData = markupArray?.Markup?.Data?.find(
    (item) => item.Type === "Monument"
  );

  // Add a new state to store the base costs without hike
  const [baseCosts, setBaseCosts] = useState([]);

  // FIXED: handleHikeChange function to prevent page reset and preserve original values
  const handleHikeChange = (e) => {
    const { value } = e.target;
    const hikePercentValue = parseFloat(value) || 0;
    
    // Update hike percent state
    setHikePercent(value);
    
    // Update form values by mapping over current values
    setMonumentFormValue((prevFormValue) => {
      return prevFormValue.map((item, index) => {
        // Use baseCosts if available, otherwise use current item costs as base
        let baseItem = baseCosts[index] || item;
        
        // If baseCosts is empty, save current costs as base costs
        if (!baseCosts[index] && item?.ItemUnitCost) {
          setBaseCosts(prev => {
            const newBaseCosts = [...prev];
            newBaseCosts[index] = {
              ...item,
              ItemUnitCost: { ...item.ItemUnitCost }
            };
            return newBaseCosts;
          });
          baseItem = item;
        }

        const originalFAdult = parseFloat(baseItem?.ItemUnitCost?.FAdult) || 0;
        const originalAdult = parseFloat(baseItem?.ItemUnitCost?.Adult) || 0;
        const originalChild = parseFloat(baseItem?.ItemUnitCost?.Child) || 0;
        const originalFChild = parseFloat(baseItem?.ItemUnitCost?.FChild) || 0;

        return {
          ...item, // Keep all existing properties
          Hike: hikePercentValue,
          ItemUnitCost: {
            ...item.ItemUnitCost,
            FAdult: originalFAdult > 0 ? Math.floor(originalFAdult + (originalFAdult * hikePercentValue) / 100) : originalFAdult,
            Adult: originalAdult > 0 ? Math.floor(originalAdult + (originalAdult * hikePercentValue) / 100) : originalAdult,
            Child: originalChild > 0 ? Math.floor(originalChild + (originalChild * hikePercentValue) / 100) : originalChild,
            FChild: originalFChild > 0 ? Math.floor(originalFChild + (originalFChild * hikePercentValue) / 100) : originalFChild,
          },
        };
      });
    });
  };

  // Update baseCosts when rates are loaded or changed (not when hike is applied)
  useEffect(() => {
    if (monumentFromValue.length > 0 && baseCosts.length === 0) {
      setBaseCosts(monumentFromValue.map(item => ({
        ...item,
        ItemUnitCost: { ...item.ItemUnitCost }
      })));
    }
  }, [monumentFromValue.length > 0 && monumentFromValue.every(item => 
    item?.ItemUnitCost?.FAdult !== undefined || 
    item?.ItemUnitCost?.Adult !== undefined
  )]);

  // Update baseCosts when service ID changes (new rates loaded)
  useEffect(() => {
    const hasValidRates = monumentFromValue.some(item => 
      parseFloat(item?.ItemUnitCost?.FAdult) > 0 || 
      parseFloat(item?.ItemUnitCost?.Adult) > 0
    );
    
    if (hasValidRates && !hikePercent) {
      setBaseCosts(monumentFromValue.map(item => ({
        ...item,
        ItemUnitCost: { ...item.ItemUnitCost }
      })));
    }
  }, [monumentFromValue?.map((item) => item?.ServiceId).join(",")]);

  // Alternative approach: Reset baseCosts when original values change significantly
  const resetBaseCosts = () => {
    setBaseCosts(monumentFromValue.map(item => ({
      ...item,
      ItemUnitCost: { ...item.ItemUnitCost }
    })));
    setHikePercent(""); // Reset hike as well
  };

  // Rest of your component code remains the same...
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
              Adult: details?.ItemUnitCost?.AdultCost || "",
              Child: details?.ItemUnitCost?.ChildCost || "",
              FAdult: details?.ItemUnitCost?.FAdultCost || "",
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
        dispatch(setLocalMonumentFormValue(monumentInitialValue));
      }
    }
  };

  useEffect(() => {
    formValueInitialization();
    setIsInitializing(false);
  },[qoutationData]);

  // ... rest of your component methods remain the same

  return (
    <div className="row mt-3 m-0">
      <Toaster position="top-center" />
      <div
        className="col-12 px-1 py-2 d-flex justify-content-between itinerary-head-bg"
        onClick={() => setIsOpen(!isOpen)}
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
                className="formControl3"
                value={hikePercent}
                onChange={handleHikeChange}
                placeholder="0"
              />
              <span className="fs-6">%</span>
            </div>
          )}
          {/* Rest of your JSX remains the same */}
        </div>
      </div>
      {/* Rest of your component JSX */}
    </div>
  );
};

export default React.memo(Monument);