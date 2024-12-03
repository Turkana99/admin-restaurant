import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { CategoriesService } from '../../../../core/services/categories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LangService } from '../../../../core/services/lang.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss'],
})
export class NewCategoryComponent implements OnInit {
  newCatForm!: FormGroup;
  showSpinner = false;
  buttonSpinner = false;
  catId: number | null = null;
  pageTitle = 'Yeni kateqoriya məlumatı';
  submitButtonText = 'Əlavə et';
  languages: any[] = [];
  subCategries: any[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoriesService,
    private langService: LangService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadLanguages();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.catId = +id;
        this.pageTitle = 'Yeni kateqoriya məlumatı - düzəliş';
        this.submitButtonText = 'Yadda saxla';
        this.getCatPageInfoWithId(this.catId);
      }
    });
  }

  loadLanguages() {
    this.langService.getLangs().subscribe(
      (response) => {
        this.languages = response.items || [];
        this.initLangControls();
      },
      (error) => {
        console.error('Error loading languages:', error);
      }
    );
  }

  initForm() {
    this.newCatForm = this.fb.group({
      categoryLangs: this.fb.array([]),
    });
  }

  initLangControls() {
    const langControls = this.languages.map((lang) =>
      this.fb.group({
        ownerId: [null],
        name: ['', Validators.required],
        languageId: [lang.id],
      })
    );
    this.newCatForm.setControl('categoryLangs', this.fb.array(langControls));
  }

  get categoryLangs(): FormArray {
    return this.newCatForm.get('categoryLangs') as FormArray;
  }

  getAllCat(pageIndex: number, pageSize: number) {
    this.categoryService
      .getCategories(pageIndex, pageSize + 1)
      .pipe(finalize(() => (this.showSpinner = false)))
      .subscribe(
        (response) => (this.subCategries = response.items),
        (error) => console.error('Error fetching subcategories:', error)
      );
  }

  getCatPageInfoWithId(id: number) {
    this.showSpinner = true;
    this.categoryService
      .getCategoryWithId(id)
      .pipe(finalize(() => (this.showSpinner = false)))
      .subscribe(
        (response) => {
          const langData = response.categoryLangs || [];
          this.categoryLangs.clear();
          langData.forEach((lang: any) => {
            this.categoryLangs.push(
              this.fb.group({
                ownerId: [lang.ownerId || null],
                name: [lang.name || '', Validators.required],
                languageId: [lang.languageId],
              })
            );
          });
        },
        (error) => console.error('Error fetching category data:', error)
      );
  }

  submit() {
    if (this.newCatForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    const formData = this.newCatForm.value;

    if (this.catId) {
      this.updateCategory(formData);
    } else {
      this.createCategory(formData);
    }
  }

  updateCategory(formData: any) {
    this.buttonSpinner = true;
    this.categoryService
      .editCategory({ ...formData, id: this.catId })
      .pipe(finalize(() => (this.buttonSpinner = false)))
      .subscribe(
        () => {
          this.newCatForm.reset();
          this.router.navigate(['/categories']);
        },
        (error) => console.error('Error updating category:', error)
      );
  }

  createCategory(formData: any) {
    this.buttonSpinner = true;
    this.categoryService
      .addCategory(formData)
      .pipe(finalize(() => (this.buttonSpinner = false)))
      .subscribe(
        () => {
          this.newCatForm.reset();
          this.router.navigate(['/categories']);
        },
        (error) => console.error('Error creating category:', error)
      );
  }
}

