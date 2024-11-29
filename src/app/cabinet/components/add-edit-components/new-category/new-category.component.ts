import { Component } from '@angular/core';
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
export class NewCategoryComponent {
  newCatForm!: FormGroup;
  showSpinner = false;
  buttonSpinner = false;
  catId: number | null = null;
  pageTitle = 'Yeni kateqoriya məlumatı';
  submitButtonText = 'Əlavə et';
  languages: any[] = [];

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

  // Fetch languages using LangService and initialize the form
  loadLanguages() {
    this.langService.getLangs().subscribe(
      (response) => {
        this.languages = response.items;
        this.initLangControls();
      },
      (error) => {
        console.error('Error loading languages:', error);
      }
    );
  }

  // Initialize the base form structure
  initForm() {
    this.newCatForm = this.fb.group({
      categoryLangs: this.fb.array([]),
    });
  }

  // Add controls for each language
  initLangControls() {
    const langControls = this.languages.map((lang) => {
      return this.fb.group({
        name: this.fb.control('', [Validators.required]),
        languageId: this.fb.control(lang.id),
      });
    });
    this.newCatForm.setControl('categoryLangs', this.fb.array(langControls));
  }

  // Helper to access form array
  get categoryLangs(): FormArray {
    return this.newCatForm.get('categoryLangs') as FormArray;
  }

  // Fetch existing category data
  getCatPageInfoWithId(id: number) {
    this.showSpinner = true;
    this.categoryService
      .getCategoryWithId(id)
      .pipe(finalize(() => (this.showSpinner = false)))
      .subscribe(
        (response) => {
          console.log('API Response:', response);
          const langData = response.categoryLangs || [];
          if (langData.length > 0) {
            this.categoryLangs.clear();
            langData.forEach((lang: any) => {
              console.log('Lang data:', lang);
              this.categoryLangs.push(
                this.fb.group({
                  name: [lang.name || '', Validators.required],
                  languageId: [lang.languageId],
                })
              );
            });
          }
        },
        (error) => {
          console.error('Error fetching category data:', error);
        }
      );
  }

  // Submit form data
  submit() {
    console.log('Form Data:', this.newCatForm.value);

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

  // Update category
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
        (error) => {
          console.error('Error updating category:', error);
        }
      );
  }

  // Create new category
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
        (error) => {
          console.error('Error creating category:', error);
        }
      );
  }
}
