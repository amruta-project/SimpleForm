sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/FilterOperator",
	"sap/ui/model/Filter",
  "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,FilterOperator,Filter,MessageBox) {
        "use strict";

        return Controller.extend("simpleform.controller.SimpleForm", {
            onInit: function () {
              this.oModel = this.getOwnerComponent().getModel();
                this.onReadProductData();
            },

            onReadProductData: function(){

                var oModel = this.getOwnerComponent().getModel();
               var oJSONModel = new sap.ui.model.json.JSONModel();
               var that=this;
                oModel.read("/ProductSet",{
                            success: function(response)
                            {
                                debugger;
                              // oJSONModel.setData(oresponse);
                                oJSONModel.setData(response.results);
                                that.getView().setModel(oJSONModel,"ProductModelData");

                                that.byId("SimpleForm").bindElement("ProductModelData>/0");
            
                            }.bind(that),
                            error: function(error){
                                debugger;
                            }
                        });
                        },

                        WeightUnitFormatter:function(unit){
                          if(unit === "KG"){
                            return 0;
                  
                          }else{
                            return 1;
                          }


                        },

           handleSelectionChange:function(evt)
            {
            debugger;
            var sValue = evt.getParameters("selected");
          var sPath = evt.getParameter('selectedItem').getBindingContext('ProductModelData').getPath();
        
           this.byId("SimpleForm").bindElement("ProductModelData>"+sPath);
           this.getView().getModel().refresh(true);

        },
            onConfirmCategory: function(oEvent){
              debugger;
              var value = oEvent.getParameter('selectedItem').getTitle();
              this.byId("category").setValue(value);
            },

            onConfirmSupplier: function(oEvent){
              debugger;
              var title = oEvent.getParameter('selectedItem').getTitle();
              this.byId("supplierName").setValue(title);

            },
            onSearchCategory :function(oEvent){
              debugger;
              var sValue = oEvent.getParameter("value");
              var oFilter = new Filter("Category", FilterOperator.Contains, sValue);
              var oBinding = oEvent.getParameter("itemsBinding");
              oBinding.filter([oFilter]);
              
            },

            onSearchSuppiler: function(oEvent){
              debugger;
              var sValue = oEvent.getParameter("value");
              var oFilter = new Filter("SupplierName", FilterOperator.Contains, sValue);
              var oBinding = oEvent.getParameter("itemsBinding");
              oBinding.filter([oFilter]);
            },

            onLiveChangeSupplier: function(Evt){
              debugger;
              var val = Evt.getParameter('value');
            if (val !== "") {
     var fil = [new sap.ui.model.Filter("SupplierName", "Contains", val)];
      this.fragment1.getBinding('items').filter(new sap.ui.model.Filter(fil, false));
            } else {
            this.fragment1.getBinding("items").filter([]);
            }
        },


        onLiveChangeCategory: function(Evt){
          debugger;
          var val = Evt.getParameter('value');
        if (val !== "") {
 var fil = [new sap.ui.model.Filter("Category", "Contains", val)];
  this.fragment.getBinding('items').filter(new sap.ui.model.Filter(fil, false));
        } else {
        this.fragment.getBinding("items").filter([]);
        }
    },

    onSaveButton: function(oEvent){
      debugger;
      var oModel = this.getOwnerComponent().getModel();
      var oJSONModel = new sap.ui.model.json.JSONModel();
      var source = oEvent.getSource(); // Get the pressed button
      var obj = this.byId("SimpleForm").getBindingContext('ProductModelData').getObject();
      
      var payLoad={
        "CurrencyCode":obj.CurrencyCode,
        "Depth":obj.Depth,
        "DescriptionLanguage": obj.DescriptionLanguage,
        "DimUnit":obj.DimUnit,
        "Height":obj.Height,
        "MeasureUnit":obj.MeasureUnit,
        "NameLanguage":obj.NameLanguage,
        "Price":obj.Price,
        "SupplierID":obj.SupplierID,
        "TaxTarifCode":obj.TaxTarifCode,
        "WeightUnit":"",
        "TypeCode":obj.TypeCode,
        "WeightMeasure":obj.WeightMeasure,
        "Width":obj.Width,
        "ProductID": obj.ProductID,
        "Category": obj.Category,
        "Name": obj.Name,
        "SupplierName": obj.SupplierName,
        "Description": obj.Description

      };

  var that =this;
  oModel.update("/ProductSet('" + obj.ProductID + "')",payLoad, {
    eTag:"*",

    success: function(response)
    {
        debugger;
        MessageBox.success("Updated successfully");
      that.onReadProductData();

    }.bind(that),
    error: function(error){
        debugger;
    }
});
},
      
            onValueHelpCategory: function() {
              debugger;
                var that = this;
                this.oModel.read("/ProductSet", {
                  success: function(response) {
                    sap.m.MessageToast.show("Record Display Successfully");
                   
                    if(! that.fragment){
                   
                    that.fragment = new sap.ui.xmlfragment("simpleform.fragments.categoryFragment", that);
                   
                }
                 
                    that.getView().addDependent(that.fragment);
                    var oJSONModel = new sap.ui.model.json.JSONModel();
                    var uniqueNames = [];
                    var uniqueNames1 = [];
                    debugger;
                    response.results.forEach(function(item) {
                       if (uniqueNames.indexOf(item.Category) === -1) {
                          uniqueNames.push(item.Category);
                          uniqueNames1.push(item);
                       }
                    });
                    debugger;
                     oJSONModel.setData(uniqueNames1);
                  //  oJSONModel.setData(response.results);
                    that.fragment.setModel(oJSONModel);
                    that.fragment.open();
                  },
                  error: function(oErr) {
                    sap.m.MessageToast.show("No data");
                  }
                });
              },


              onValueHelpSupplier:function(){

                debugger;
                var that = this;
                this.oModel.read("/ProductSet", {
                  success: function(response) {
                    sap.m.MessageToast.show("Record Display Successfully");
                   
                    if(! that.fragment1){
                   
                    that.fragment1 = new sap.ui.xmlfragment("simpleform.fragments.supplierFragment", that);
                   
                }
                 
                    that.getView().addDependent(that.fragment1);
                    var oJSONModel = new sap.ui.model.json.JSONModel();
                   // response.results = [];
                   
                   var uniqueNames = [];
                   var uniqueNames2 = [];
                   debugger;
                   response.results.forEach(function(item) {
                      if (uniqueNames.indexOf(item.SupplierName) === -1) {
                         uniqueNames.push(item.SupplierName);
                         uniqueNames2.push(item);
                      }
                   });
                   debugger;
                    oJSONModel.setData(uniqueNames2);

                   // oJSONModel.setData(response.results);
                    that.fragment1.setModel(oJSONModel);
                    that.fragment1.open();
                  },
                  error: function(oErr) {
                    sap.m.MessageToast.show("No data");
                  }
                });

              },

        });
    });
