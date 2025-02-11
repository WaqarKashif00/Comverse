import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { FlexLayoutModule } from '@angular/flex-layout';
import { QuillModule } from 'ngx-quill';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { RECAPTCHA_SETTINGS, RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatTabsModule } from '@angular/material/tabs';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './auth/signin/signin.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { LoggedInAuthGuard, LoggedOutAuthGuard } from './auth/auth.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigurationComponent } from './views/configuration/configuration.component';
import { TransferOwnershipDialog, UserManagementComponent } from './views/configuration/user-management/user-management.component';
import { AddUserComponent } from './views/configuration/user-management/add-user/add-user.component';
import { ChangePasswordDialog, UserInfoComponent, RemoveUserDialog } from './views/configuration/user-management/user-info/user-info.component';
import { AcceptInviteComponent } from './auth/accept-invite/accept-invite.component';
import { TaxConfigurationComponent } from './views/configuration/tax-configuration/tax-configuration.component';
import { GeneralInformationComponent } from './views/configuration/general-information/general-information.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ImportProductsDialog, ProductsChangeApprovalDialog, ProductsChangeStatusDialog, ProductsComponent, AddBulkTagsDialog, ProductsBulkOrganizeDialog, ProductsBulkDeleteDialog, ProductsExportDialog } from './views/products/products.component';
import { CategoryStructureComponent } from './views/products/category-structure/category-structure.component';
import { NewMainCategoryComponent } from './views/products/category-structure/main-category/new-main-category/new-main-category.component';
import { NewSubCategoryComponent } from './views/products/category-structure/sub-category/new-sub-category/new-sub-category.component';
import { EditMainCategoryComponent } from './views/products/category-structure/main-category/edit-main-category/edit-main-category.component';
import { EditSubCategoryComponent } from './views/products/category-structure/sub-category/edit-sub-category/edit-sub-category.component';
import { CollectionDeleteDialog, CollectionsChangeApprovalStatusDialog, CollectionsChangeStatusDialog, CollectionsComponent } from './views/products/collections/collections.component';
import { AddCollectionComponent } from './views/products/collections/add-collection/add-collection.component';
import { EditCollectionComponent } from './views/products/collections/edit-collection/edit-collection.component';
import { AddProductComponent, VideoPreviewDialog } from './views/products/add-product/add-product.component';
import { DeleteProductGroupDialog, ProductGroupsComponent } from './views/products/product-groups/product-groups.component';
import { AddProductGroupComponent } from './views/products/product-groups/add-product-group/add-product-group.component';
import { EditProductGroupComponent } from './views/products/product-groups/edit-product-group/edit-product-group.component';
import { NewSuperSubCategoryComponent } from './views/products/category-structure/super-sub-category/new-super-sub-category/new-super-sub-category.component';
import { EditSuperSubCategoryComponent } from './views/products/category-structure/super-sub-category/edit-super-sub-category/edit-super-sub-category.component';
import { DeleteVariantConfirmDialog, EditProductComponent, EditProductOptionsDialog } from './views/products/edit-product/edit-product.component';
import { BrandDeleteDialog, BrandsComponent } from './views/products/brands/brands.component';
import { AddBrandComponent } from './views/products/brands/add-brand/add-brand.component';
import { EditBrandComponent } from './views/products/brands/edit-brand/edit-brand.component';
import { DiscountsComponent, DiscountDeleteDialog } from './views/discounts/discounts.component';
import { EditVariantComponent } from './views/products/edit-variant/edit-variant.component';
import { AddVariantComponent } from './views/products/add-variant/add-variant.component';
import { AddDiscountComponent } from './views/discounts/add-discount/add-discount.component';
import { EditDiscountComponent } from './views/discounts/edit-discount/edit-discount.component';
import { AddShippingDialog, AddZoneDialog, DeleteShippingDialog, DeleteZoneDialog, EditShippingDialog, ShippingComponent, ViewZoneDialog } from './views/configuration/shipping/shipping.component';
import { OrdersComponent, OrdersExportDialog, SalesReportDialog } from './views/orders/orders.component';
import { AddOrderComponent } from './views/orders/add-order/add-order.component';
import { CustomerDeleteDialog, CustomersComponent } from './views/customers/customers.component';
import { AddCustomerComponent } from './views/customers/add-customer/add-customer.component';
import { EditCustomerComponent } from './views/customers/edit-customer/edit-customer.component';
import { VariantSelectorComponent, VariantSelectorDialog } from './shared/variant-selector/variant-selector.component';
import { EditMainOrderComponent } from './views/orders/edit-main-order/edit-main-order.component';
import { CustomerAddressDialog } from './views/orders/dialogs/CustomerAddressDialog';
import { PaymentMethodDialog } from './views/orders/dialogs/PaymentMethodDialog';
import { DraftOrdersComponent } from './views/orders/draft-orders/draft-orders.component';
import { EditChildOrderComponent } from './views/orders/edit-child-order/edit-child-order.component';
import { EditDraftOrderComponent } from './views/orders/edit-draft-order/edit-draft-order.component';
import { PageDeleteDialog, PagesComponent } from './views/cms/pages/pages.component';
import { AddPageComponent } from './views/cms/pages/add-page/add-page.component';
import { EditPageComponent } from './views/cms/pages/edit-page/edit-page.component';
import { HomepageComponent, HomepageAddSectionDialog } from './views/cms/homepage/homepage.component';
import { VendorsComponent, DeleteVendorDialog } from './views/vendors/vendors.component';
import { AddVendorComponent } from './views/vendors/add-vendor/add-vendor.component';
import { NavigationDeleteDialog, NavigationsComponent } from './views/cms/navigations/navigations.component';
import { AddNavigationComponent } from './views/cms/navigations/add-navigation/add-navigation.component';
import { EditNavigationComponent } from './views/cms/navigations/edit-navigation/edit-navigation.component';
import { EditNavigationNodeComponent } from './views/cms/navigations/edit-navigation-node/edit-navigation-node.component';
import { DeleteCommissionDialog, EditVendorComponent } from './views/vendors/edit-vendor/edit-vendor.component';
import { HomepageSliderSection, HomepageCategoriesCarousel, HomepageBrands, HomepageProductsCarousel, HomepageSingleBanner, HomepageCategoriesTabs, HomepageTwoBanners, HomepageFeatureIcons, HomepageFourBanners } from './views/cms/homepage/homepage-sections.components';
import { HeaderCustomizationComponent } from './views/cms/customization-header/customization-header.component';
import { FooterCustomizationComponent } from './views/cms/footer-customization/footer-customization.component';
import { NavigationSelectorComponent } from './views/cms/navigations/navigation-selector/navigation-selector.component';
import { NavigationSelectorDialogComponent } from './views/cms/navigations/navigation-selector-dialog/navigation-selector-dialog.component';
import { ShippingZoneComponent } from './views/configuration/shipping/zones/shipping-zone/shipping-zone.component';
import { DeleteShippingRateDialog, ShippingRatesComponent } from './views/configuration/shipping/shipping-rates/shipping-rates.component';
import { AddShippingRatesComponent } from './views/configuration/shipping/shipping-rates/add-shippping-rate/add-shipping-rate.component';
import { DefaultShippingComponent } from './views/configuration/shipping/default-shipping/default-shipping.component';
import { MultiSelectDialog, MultiSelectModelComponent } from './shared/multi-select-model/multi-select-model.component';
import { AddFilterDialog, FiltersComponent } from './views/cms/filters/filters/filters.component';
import { AddChildOrderComponent } from './views/orders/add-child-order/add-child-order.component';
import { ProductSelectorComponent, ProductSelectorDialog } from './shared/product-selector/product-selector.component';
import { CouponsComponent, CouponDeleteDialog } from './views/discounts/coupons/coupons.component';
import { AddCouponComponent } from './views/discounts/coupons/add-coupon/add-coupon.component';
import { EditCouponComponent } from './views/discounts/coupons/edit-coupon/edit-coupon.component';
import { ShippingRegionsComponent } from './views/configuration/shipping-regions/shipping-regions.component';
import { CountriesComponent } from './views/configuration/shipping-regions/countries/countries.component';
import { CitiesComponent, CityDeleteDialog, CityDialog } from './views/configuration/shipping-regions/countries/cities/cities.component';
import { CheckoutCustomizationComponent } from './views/configuration/checkout-customization/checkout-customization.component';
import { OrderTimelineComponent } from './views/orders/shared/order-timeline/order-timeline.component';
import { CancelOrderDialog } from './views/orders/dialogs/cancelOrderDialog';
import { ContentApprovalComponent, ContentDisapprovalReasonDialog, DisapproveRequestDialog } from './views/content-approval/content-approval.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from './shared/shared.module';
import { FeaturedAppsComponent } from './featured-apps/featured-apps.component';
import { CacheSettingComponent } from './views/configuration/cache-setting/cache-setting.component';
import { PreferencesComponent } from './views/configuration/preferences/preferences.component';
import { PaymentGatewaysComponent, RemovePaymentGateway } from './views/configuration/payment-gateways/payment-gateways.component';
import { PaymentGatewaysFormComponent } from './views/configuration/payment-gateways/payment-gateways-form/payment-gateways-form.component';
import { SmsConfigurationComponent } from './views/configuration/sms-configuration/sms-configuration.component';
import { SmsTemplateComponent, MessageTemplateDeleteDialog, MessageTemplateDialog } from './views/configuration/sms-configuration/sms-template/sms-template.component';
import { SmsProviderComponent, MessageServiceProviderDeleteDialog, MessageServiceProviderDialog } from './views/configuration/sms-configuration/sms-provider/sms-provider.component';
import { SmsLogsComponent } from './views/configuration/sms-configuration/sms-logs/sms-logs.component';
import { EmailConfigurationComponent } from './views/configuration/email-configuration/email-configuration.component';
import { EmailLogsComponent } from './views/configuration/email-configuration/email-logs/email-logs.component';
import { EmailProviderComponent, EmailServiceProviderDeleteDialog, EmailServiceProviderDialog } from './views/configuration/email-configuration/email-provider/email-provider.component';
import { EmailTemplateComponent, EmailTemplateDeleteDialog, EmailTemplateDialog } from './views/configuration/email-configuration/email-template/email-template.component';
import { SalesReportComponent } from './views/reporting/sales-report/sales-report.component';
import { ReportingSettingsComponent, DeleteReportDialog } from './views/reporting/reporting-settings/reporting-settings.component';
import { CreateReportSettingComponent } from './views/reporting/create-report-setting/create-report-setting.component';
import { EditReportSettingComponent } from './views/reporting/edit-report-setting/edit-report-setting.component';
import { OrderLogsComponent } from './views/orders/order-logs/order-logs/order-logs.component';
import { StoreSettingComponent } from './views/configuration/store-setting/store-setting.component';
import { ProductReviewCommentDialog, ProductReviewDeleteDialog, ProductReviewsComponent } from './views/products/product-reviews/product-reviews.component';
import { ProductReviewDetailComponent } from './views/products/product-reviews/product-review-detail/product-review-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    DashboardComponent,
    ConfigurationComponent,
    UserManagementComponent,
    TransferOwnershipDialog,
    AddUserComponent,
    UserInfoComponent,
    AcceptInviteComponent,
    TaxConfigurationComponent,
    GeneralInformationComponent,
    ChangePasswordDialog,
    PageDeleteDialog,
    RemoveUserDialog,
    ForgotPasswordComponent,
    ProductsComponent,
    CategoryStructureComponent,
    NewMainCategoryComponent,
    NewSubCategoryComponent,
    EditMainCategoryComponent,
    EditSubCategoryComponent,
    CollectionsComponent,
    AddCollectionComponent,
    ProductReviewDeleteDialog,
    ProductReviewCommentDialog,
    EditCollectionComponent,
    ImportProductsDialog,
    ProductsChangeStatusDialog,
    ProductsChangeApprovalDialog,
    AddBulkTagsDialog,
    ProductsBulkOrganizeDialog,
    ProductsBulkDeleteDialog,
    AddProductComponent,
    ProductGroupsComponent,
    AddProductGroupComponent,
    EditProductGroupComponent,
    CollectionsChangeStatusDialog,
    CollectionsChangeApprovalStatusDialog,
    CollectionDeleteDialog,
    NewSuperSubCategoryComponent,
    EditSuperSubCategoryComponent,
    EditProductComponent,
    DeleteVariantConfirmDialog,
    EditProductOptionsDialog,
    BrandsComponent,
    AddBrandComponent,
    EditBrandComponent,
    DeleteProductGroupDialog,
    DiscountsComponent,
    EditVariantComponent,
    AddVariantComponent,
    AddDiscountComponent,
    EditDiscountComponent,
    ShippingComponent,
    AddShippingDialog,
    AddZoneDialog,
    EditShippingDialog,
    DeleteShippingDialog,
    BrandDeleteDialog,
    OrdersComponent,
    AddOrderComponent,
    CustomersComponent,
    AddCustomerComponent,
    EditCustomerComponent,
    CustomerDeleteDialog,
    VariantSelectorComponent,
    VariantSelectorDialog,
    EditMainOrderComponent,
    CustomerAddressDialog,
    PaymentMethodDialog,
    DraftOrdersComponent,
    EditChildOrderComponent,
    EditDraftOrderComponent,
    ProductsExportDialog,
    OrdersExportDialog,
    PagesComponent,
    AddPageComponent,
    EditPageComponent,
    HomepageComponent,
    VendorsComponent,
    AddVendorComponent,
    EditVendorComponent,
    DeleteVendorDialog,
    VideoPreviewDialog,
    NavigationsComponent,
    AddNavigationComponent,
    HomepageSliderSection,
    DiscountDeleteDialog,
    HomepageCategoriesCarousel,
    HomepageBrands,
    HomepageProductsCarousel,
    HomepageSingleBanner,
    HomepageCategoriesTabs,
    HomepageTwoBanners,
    HomepageFourBanners,
    HomepageFeatureIcons,
    HomepageAddSectionDialog,
    HeaderCustomizationComponent,
    FooterCustomizationComponent,
    EditNavigationComponent,
    EditNavigationNodeComponent,
    NavigationSelectorComponent,
    NavigationSelectorDialogComponent,
    NavigationDeleteDialog,
    ShippingZoneComponent,
    ShippingRatesComponent,
    DeleteZoneDialog,
    ViewZoneDialog,
    AddShippingRatesComponent,
    DeleteShippingRateDialog,
    DefaultShippingComponent,
    MultiSelectModelComponent,
    MultiSelectDialog,
    FiltersComponent,
    AddFilterDialog,
    AddChildOrderComponent,
    DeleteCommissionDialog,
    ProductSelectorComponent,
    ProductSelectorDialog,
    CouponsComponent,
    AddCouponComponent,
    EditCouponComponent,
    CouponDeleteDialog,
    ShippingRegionsComponent,
    CountriesComponent,
    CitiesComponent,
    CityDeleteDialog,
    CityDialog,
    CheckoutCustomizationComponent,
    OrderTimelineComponent,
    CancelOrderDialog,
    ContentApprovalComponent,
    DisapproveRequestDialog,
    ContentDisapprovalReasonDialog,
    FeaturedAppsComponent,
    CacheSettingComponent,
    PreferencesComponent,
    PaymentGatewaysComponent,
    RemovePaymentGateway,
    PaymentGatewaysFormComponent,
    SmsConfigurationComponent,
    SmsTemplateComponent,
    MessageTemplateDeleteDialog,
    MessageTemplateDialog,
    SmsProviderComponent,
    MessageServiceProviderDeleteDialog,
    MessageServiceProviderDialog,
    SmsLogsComponent,
    EmailConfigurationComponent,
    EmailLogsComponent,
    EmailProviderComponent,
    EmailServiceProviderDeleteDialog,
    EmailServiceProviderDialog,
    EmailTemplateComponent,
    EmailTemplateDeleteDialog,
    EmailTemplateDialog,
    SalesReportDialog,
    SalesReportComponent,
    ReportingSettingsComponent,
    CreateReportSettingComponent,
    DeleteReportDialog,
    EditReportSettingComponent,
    OrderLogsComponent,
    StoreSettingComponent,
    ProductReviewsComponent,
    ProductReviewDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InlineSVGModule.forRoot(),
    BrowserAnimationsModule,
    FlexLayoutModule,
    QuillModule.forRoot(),
    AngularFileUploaderModule,
    NgxDaterangepickerMd.forRoot(),
    RecaptchaModule,
    RecaptchaFormsModule,

    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDividerModule,
    MatTableModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatSelectModule,
    MatRadioModule,
    MatPaginatorModule,
    MatMenuModule,
    MatChipsModule,
    MatExpansionModule,
    MatListModule,
    MatProgressSpinnerModule,
    DragDropModule,
    NgxDropzoneModule,
    NgxChartsModule,
    SharedModule,
    MatTabsModule
  ],
  providers: [
    LoggedInAuthGuard,
    LoggedOutAuthGuard,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: "6LcbBaYfAAAAAHUtuaqxenE3v7WaV9ctOUhnjZVA"
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
